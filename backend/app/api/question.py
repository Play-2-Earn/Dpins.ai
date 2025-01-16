from time import sleep
from flask import Flask, Blueprint, Response, json, request, jsonify
from mongoengine import *
import requests
import uuid
from datetime import datetime
from ..api.models import User, Question, QuestionExtension, QuestionStatus, Wallet
from datetime import timedelta
import jwt
import os
from dotenv import load_dotenv
from flask_cors import cross_origin
from bson import ObjectId
from cloudinary.uploader import upload
import cloudinary
from gridfs import GridFS
from pymongo import MongoClient


MONGODB_HOST = os.getenv("MONGO_URI")
client = MongoClient(MONGODB_HOST)
db = client['stake_city']
fs = GridFS(db)  # Initialize GridFS

load_dotenv()
cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key= os.getenv("API_KEY"),
    api_secret= os.getenv("API_SECRET")
)

# Blueprint for questions
question_bp = Blueprint('questions', __name__)

# Function to get location name using OpenStreetMap (Nominatim) API
def get_location_name(latitude, longitude):
    url = f'https://nominatim.openstreetmap.org/reverse?lat={latitude}&lon={longitude}&format=json'
    headers = {
        'User-Agent': 'StakeCityApp/1.0 (your_email@example.com)'  # Replace with your app info
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        location_data = response.json()
        return location_data.get('display_name')  # Fetch the full location name
    else:
        return None

RAW_EXTENSIONS = {"docx", "doc", "pdf","xls", "xlsx", "png", "jpeg" , "jpg" , "ppt" , "pptx"}

@question_bp.route('/api/drop_task', methods=['POST'])
def pin_location_and_ask_question():
    header = request.headers
    auth_token = header.get('Authorization')
    if not auth_token:
        return jsonify({"message": "Authorization token is required."}), 401
    auth_token = auth_token.split(' ')[1]

    try:
        secret_key = os.getenv('SECRET_KEY')
        decoded_token = jwt.decode(auth_token, secret_key, algorithms=["HS256"])
        user_name = decoded_token.get('user_name')
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired."}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token."}), 401

    user = User.objects(user_name=user_name).first()
    if not user:
        return jsonify({"message": "User not found."}), 404

    try:
        expired_tasks = Question.objects(user=user, status=QuestionStatus.EXPIRED_PENDING_RELEASE.value)
        if expired_tasks:
            task_list = [{"question_id": str(task.id), "question_title": task.question_title} for task in expired_tasks]
            return jsonify({"message": "You have expired tasks pending to release.", "expired_tasks": task_list}), 400
    except Exception as e:
        return jsonify({"message": f"Error checking tasks: {str(e)}"}), 500

    title = request.form.get('taskTitle')
    question = request.form.get('taskDescription')
    latitude = request.form.get('lat')
    longitude = request.form.get('lng')
    stake_amount = request.form.get('stakeAmount')
    verbal_address = request.form.get('verbalAddress')
    files = request.files.getlist('files')

    if not question or not latitude or not longitude or stake_amount is None:
        return jsonify({"message": "task, latitude, longitude, and stake_amount are required."}), 400

    try:
        stake_amount = float(stake_amount)
        if stake_amount <= 0:
            return jsonify({"message": "stake_amount must be positive."}), 400
    except ValueError:
        return jsonify({"message": "Invalid stake_amount."}), 400

    uploaded_files = []
    errors = []
    for file in files:
        if file.filename != '':
            file_extension = file.filename.rsplit('.', 1)[1].lower()
            if file_extension == 'txt':
                try:
                    file_id = fs.put(file, filename=file.filename)
                    uploaded_files.append({"filename": file.filename, "url": str(file_id)})
                except Exception as e:
                    errors.append({"filename": file.filename, "error": str(e)})
            else:
                resource_type = "raw" if file_extension in RAW_EXTENSIONS else "auto"
                try:
                    result = upload(file, resource_type=resource_type)
                    if resource_type == "raw":
                        url_last_part = result['url'].split('/')[-1]
                        result = cloudinary.uploader.rename(
                            url_last_part,
                            f"{url_last_part}.{file_extension}",
                            resource_type="raw"
                        )
                    uploaded_files.append({"filename": file.filename, "url": result['url']})
                except Exception as e:
                    errors.append({"filename": file.filename, "error": str(e)})

    visible_until = datetime.utcnow() + timedelta(days=90)
    new_question = Question(
        user=user.id,
        user_name=user.user_name,
        question_text=question,
        question_title=title,
        coordinates={'lat': latitude, 'lng': longitude},
        stake_amount=stake_amount,
        location_name=verbal_address,
        visible_until=visible_until,
        file_ids=[file['url'] for file in uploaded_files]
    )
    new_question.save()
    new_question.update(set__question_id=str(new_question.id))

    wallet = Wallet.objects(user=user).first()
    wallet.balance -= stake_amount
    wallet.locked_amount += stake_amount
    wallet.save()

    navigation_url = f"https://www.google.com/maps?q={latitude},{longitude}"
    share_url = f"{os.getenv('SHARE_HOST')}/explore/{str(new_question.id)}"

    return jsonify({
        "question_id": str(new_question.id),
        "full_name": user.full_name,
        "user_name": user.user_name,
        "taskTitle": title,
        "taskDescription": question,
        "navigation_url": navigation_url,
        "location_name": verbal_address,
        "stake_amount": stake_amount,
        "visible_until": visible_until,
        "share_url": share_url,
        "uploaded_files": uploaded_files,
        "errors": errors
    }), 207 if errors else 200

# Get All Active Tasks
@question_bp.route('/api/get_all_tasks', methods=['GET'])
def get_user_questions():
    try:
        header = request.headers
        auth_token = header.get('Authorization')
        if not auth_token:
            return jsonify({"message": "Authorization token is required."}), 401
        auth_token = auth_token.split(' ')[1]
        # Verify the token
        try:
            secret_key = os.getenv('SECRET_KEY')
            decoded_token = jwt.decode(auth_token, secret_key, algorithms=["HS256"])
            user_name = decoded_token.get('user_name')
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token."}), 401

        # Fetch user object
        user = User.objects(user_name=user_name).first()
        if not user:
            return jsonify({"message": "User not found."}), 404

        # Function that generates events to be sent over the SSE stream every 60s
        def generateEvent():
            while True:
                # Fetch question objects
                questions = Question.objects(status=QuestionStatus.ACTIVE.value)

                # Format the questions into a list of dictionaries containing the required location data
                questions_data = []

                for question in questions:
                    try:
                        # Safely handle user reference
                        user_name = question.user.user_name if question.user else "Unknown User"
                        full_name = question.user.full_name if question.user else "Unknown"

                        question_data = {
                            "question_id": str(question.id),
                            "user_name": user_name,
                            "full_name": full_name,
                            "taskTitle": question.question_title,
                            "taskDescription": question.question_text,
                            "coordinates": question.coordinates,
                            "stake_amount": question.stake_amount,
                            "location_name": question.location_name,
                            "visible_until": question.visible_until,
                            "share_url": f"{os.getenv("SHARE_HOST")}/explore/{str(question.id)}",
                            "navigation_url": f"https://www.google.com/maps?q={question.coordinates['lat']},{question.coordinates['lng']}",
                            "uploaded_files": question.file_ids,

                        }
                        questions_data.append(question_data)
                    except Exception as e:
                        # Log the error for the specific question
                        print(f"Error processing question {question.id}: {str(e)}")

                # Send the list of question data as a JSON event
                yield f"data: {json.dumps(questions_data)}\n\n"

                sleep(60)

        # Return response as an event stream
        return Response(generateEvent(), content_type="text/event-stream")
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 400


@question_bp.route('/api/view_question/<question_id>', methods=['GET'])
def view_question(question_id):
    # Attempt to find the question by ID
    question = Question.objects(id=question_id).first()

    if not question:
        return jsonify({"message": "Question not found."}), 404

    # Return the question details if the user is registered
    return jsonify({
        "question_id": str(question.id),
        "full_name": question.user.full_name,
        "user_name": question.user.user_name,
        "taskTitle": question.question_title,
        "taskDescription": question.question_text,
        "coordinates": question.coordinates,
        "stake_amount": question.stake_amount,
        "location_name": question.location_name,
        "visible_until": question.visible_until,
        "share_url": f"http:localhost:5173/explore/{str(question.id)}",
        "navigation_url": f"https://www.google.com/maps?q={question.coordinates['lat']},{question.coordinates['lng']}",
        "uploaded_files": question.file_ids
        # If you have an updated_at field, uncomment the line below
        # "updated_at": question.updated_at,
    }), 200


# Route to delete a question
@question_bp.route('/api/extend_question', methods=['POST'])
def extend_question():
    data = request.json
    question_id = data.get('question_id')
    extension_days = data.get('extension_days')

    if not question_id or not extension_days:
        return jsonify({"message": "question_id and extension_days are required."}), 400

    if not (1 <= extension_days <= 30):
        return jsonify({"message": "You can only extend between 1 and 30 days."}), 400

    question = Question.objects(question_id=question_id).first()
    if not question:
        return jsonify({"message": "Question not found."}), 404

    # Check if the question has already been extended
    if question.has_been_extended:
        return jsonify({"message": "This question has already been extended once."}), 403

    # Extend the question
    question.visible_until += timedelta(days=extension_days)
    question.has_been_extended = True  # Mark as extended
    question.save()

    # Log the extension
    new_extension = QuestionExtension(
        question=question,
        extended_by_days=extension_days
    )
    new_extension.save()

    return jsonify({
        "message": f"Question extended by {extension_days} days.",
        "new_visible_until": question.visible_until
    }), 200
