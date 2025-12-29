from fastapi import FastAPI, HTTPException, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse, JSONResponse
import json
import qrcode
import hashlib
import os
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import base64
import datetime
import csv
import io

# Define paths first
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CERTIFICATE_DATA_FILE = os.path.join(BASE_DIR, "assets", "data2.json")
TICKET_DATA_FILE = os.path.join(BASE_DIR, "assets", "data-tickets.json")
TEMPLATE_PATH = os.path.join(BASE_DIR, "assets", "event.png")
CERTIFICATE_TEMPLATE_PATH = os.path.join(BASE_DIR, "assets", "certificate.png")
FONT_PATH = os.path.join(BASE_DIR, "assets", "arial.ttf")

# Initialize FastAPI app and middleware
app = FastAPI()
origins = [
    "http://localhost:5000",  # Allow frontend to access API on this URL
    "http://localhost:3000", 
    "http://localhost",  # Replit domain
    "https://linpack.vercel.app",  # For localhost access
    "https://linpack.vercel.app"  # Add your Vercel domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # Allow frontend URL to access API
    allow_credentials=True,
    allow_methods=["*"],     # Allow all HTTP methods
    allow_headers=["*"],     # Allow all headers
)

# Global variables to store data
CERTIFICATE_USERS_DATA = []
TICKET_USERS_DATA = []

# Certificate configurations for different events
CERTIFICATE_CONFIGS = {
    "default": {
        "template": "api/assets/certificates/certificate.png",
        "font": "api/assets/fonts/arial.ttf",
        "font_size": 80,
        "color": "#D41515",
        "name_position": (1000, 600),
        "alignment": "center"
    },
    "draft-to-direction": {
        "template": "api/assets/draft-to-direction/certificate.png",  # Updated path
        "font": "api/assets/draft-to-direction/Fineday.ttf",  # Updated path - check if font file exists
        "font_size": 80,
        "color": "#1897c7",
        "name_position": (1000, 630),  # Adjust x, y as needed
        "alignment": "center"
    }
}

def load_data():
    global CERTIFICATE_USERS_DATA, TICKET_USERS_DATA
    try:
        if os.path.exists(CERTIFICATE_DATA_FILE):
            with open(CERTIFICATE_DATA_FILE, "r") as file:
                CERTIFICATE_USERS_DATA = json.load(file)
        
        if os.path.exists(TICKET_DATA_FILE):
            with open(TICKET_DATA_FILE, "r") as file:
                TICKET_USERS_DATA = json.load(file)
                
        return True
    except Exception as e:
        print(f"Error loading data: {str(e)}")
        return False

# Try to load data on startup
load_data()

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Request path: {request.url.path}")
    print(f"Request method: {request.method}")
    try:
        response = await call_next(request)
        print(f"Response status: {response.status_code}")
        return response
    except Exception as e:
        print(f"Error: {str(e)}")
        raise

@app.get("/api/py/health")
async def health_check():
    """Check API and data file health"""
    health_status = {
        "status": "ok",
        "timestamp": datetime.datetime.now().isoformat(),
        "files": {},
        "data": {
            "certificate_users": len(CERTIFICATE_USERS_DATA),
            "ticket_users": len(TICKET_USERS_DATA)
        }
    }

    try:
        # Check files existence first
        files_to_check = {
            "certificate_data": CERTIFICATE_DATA_FILE,
            "ticket_data": TICKET_DATA_FILE,
            "certificate_template": CERTIFICATE_TEMPLATE_PATH,
            "ticket_template": TEMPLATE_PATH,
            "font": FONT_PATH
        }

        for name, filepath in files_to_check.items():
            exists = os.path.exists(filepath)
            health_status["files"][name] = {
                "exists": exists,
                "path": filepath
            }
            if not exists:
                health_status["status"] = "degraded"

        return health_status

    except Exception as e:
        print(f"Health check error: {str(e)}")
        return {
            "status": "error",
            "timestamp": datetime.datetime.now().isoformat(),
            "message": [f"Health check failed: {str(e)}"],
            "files": health_status["files"]
        }

def normalize_name(name):
    """Helper function to normalize names for comparison"""
    return ''.join(name.lower().split())

@app.get("/api/py/get-valid-names")
async def get_valid_names():
    """Return all valid names from both databases"""
    try:
        certificate_names = [user["name"] for user in CERTIFICATE_USERS_DATA]
        ticket_names = [user["name"] for user in TICKET_USERS_DATA]
        all_names = list(set(certificate_names + ticket_names))  # Remove duplicates
        return {"names": sorted(all_names)}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch names: {str(e)}"
        )

@app.post("/api/py/generate-ticket")
async def generate_ticket(name: str = Form(...), reg_no: str = Form(...)):
    print(f"Received input: name='{name}', reg_no='{reg_no}'")
    
    # Find the user in ticket database
    matching_user = None
    valid_names = []
    
    for user in TICKET_USERS_DATA:
        valid_names.append(user["name"])
        if user["reg_number"].strip() == reg_no.strip():
            normalized_stored_name = normalize_name(user["name"])
            if normalize_name(name) == normalized_stored_name:
                matching_user = user
                break
    
    if not matching_user:
        print("User not found!")
        raise HTTPException(
            status_code=404, 
            detail="No User Found"  # Simplified error message
        )

    # Use stored name from database
    stored_name = matching_user["team_id"]
    stored_reg_no = matching_user["reg_number"]
    print(f"Using stored name: {stored_name}")

    # Use the hash field name that matches the JSON structure
    hashed_data = matching_user["hashed_code"]
    print(f"Using stored hash: {hashed_data}")

    qr = qrcode.make(hashed_data)  # Only store the hash
    qr = qr.resize((300, 300))
    print("QR Code generated with hash!")

    # Load ticket template
    if not os.path.exists(TEMPLATE_PATH):
        raise FileNotFoundError("Error: ticket.png template not found!")
    ticket = Image.open(TEMPLATE_PATH)
    print("Ticket template loaded!")

    # Paste QR Code at specified position
    qr_code_position = (1520, 150)  # (x, y)
    ticket.paste(qr, qr_code_position)
    print("QR Code pasted!")

    # Draw text
    draw = ImageDraw.Draw(ticket)
    try:
        font = ImageFont.truetype(FONT_PATH, 50)  # Adjust font size as needed
    except IOError:
        print("Warning: Font not found! Using default font.")
        font = ImageFont.load_default()
    print("Font loaded!")

    # Name and Reg Number positions
    name_position = (1150, 460)  
    reg_number_position = (1530, 540)  

    draw.text(name_position, f"{stored_name}", font=font, fill="White")
    draw.text(reg_number_position, f"{stored_reg_no}", font=font, fill="black")
    print("Text drawn!")

    # Generate ticket in memory only
    img_byte_arr = BytesIO()
    ticket.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)

    return StreamingResponse(
        img_byte_arr,
        media_type="image/png",
        headers={
            'Content-Disposition': f'attachment; filename="{stored_reg_no}_ticket.png"'
        }
    )

@app.post("/api/py/generate-certificate")
async def generate_certificate(name: str = Form(...)):
    print(f"Received input: name='{name}'")
    
    # Normalize the input name
    normalized_input_name = normalize_name(name)
    
    # Find the user in certificate database
    matching_user = None
    valid_names = []
    
    for user in CERTIFICATE_USERS_DATA:
        valid_names.append(user["name"])
        normalized_stored_name = normalize_name(user["name"])
        if normalize_name(name) == normalized_stored_name:
            matching_user = user
            break
    
    if not matching_user:
        print("User not found!")
        raise HTTPException(
            status_code=404, 
            detail="No User Found"  # Simplified error message
        )

    # Use the stored name from JSON instead of input name
    stored_name = matching_user["name"]
    print(f"Using stored name: {stored_name}")

    hashed_data = matching_user["certificate_hash"]
    print(f"Using stored hash: {hashed_data}")

    qr = qrcode.make(hashed_data)  # Only store the hash
    qr = qr.resize((200, 200))
    print("QR Code generated with hash!")

    if not os.path.exists(CERTIFICATE_TEMPLATE_PATH):
        raise FileNotFoundError("Error: certificate template not found!")

    certificate = Image.open(CERTIFICATE_TEMPLATE_PATH)
    print("Certificate template loaded!")

    qr_code_position = (1650, 1100)  # (x, y)
    certificate.paste(qr, qr_code_position)
    print("QR Code pasted!")

    draw = ImageDraw.Draw(certificate)
    try:
        font = ImageFont.truetype(FONT_PATH, 75)  # Adjust font size as needed
    except IOError:
        print("Warning: Font not found! Using default font.")
        font = ImageFont.load_default()
    print("Font loaded!")

    # Name position only (removing reg_no)
    name_position = (600, 550)  
    draw.text(name_position, f"{stored_name}", font=font, fill="Brown")
    print("Name drawn!")

    # Generate certificate in memory only
    img_byte_arr = BytesIO()
    certificate.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)

    return StreamingResponse(
        img_byte_arr,
        media_type="image/png",
        headers={
            'Content-Disposition': f'attachment; filename="{stored_name}_certificate.png"'
        }
    )

def load_csv_data(csv_path):
    """Load participant data from CSV file"""
    participants = []
    try:
        with open(csv_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                participants.append(row)
    except Exception as e:
        print(f"Error loading CSV: {e}")
    return participants

def generate_certificate_with_config(name, config, x_offset=0, y_offset=0):
    """Generate certificate with specific configuration"""
    try:
        # Load template
        template_path = config["template"]
        if not os.path.exists(template_path):
            print(f"Template not found at: {template_path}")
            print(f"Current directory: {os.getcwd()}")
            return None
            
        certificate = Image.open(template_path)
        draw = ImageDraw.Draw(certificate)
        
        # Load font
        font_path = config["font"]
        if not os.path.exists(font_path):
            print(f"Font not found at: {font_path}")
            # Fallback to default font
            try:
                font = ImageFont.truetype("arial.ttf", config["font_size"])
            except:
                font = ImageFont.load_default()
        else:
            font = ImageFont.truetype(font_path, config["font_size"])
        
        # Convert hex color to RGB
        color = config["color"]
        if color.startswith("#"):
            color = tuple(int(color[i:i+2], 16) for i in (1, 3, 5))
        
        # Calculate position with offset
        x, y = config["name_position"]
        x += x_offset
        y += y_offset
        
        # Draw text based on alignment
        if config["alignment"] == "center":
            bbox = draw.textbbox((0, 0), name, font=font)
            text_width = bbox[2] - bbox[0]
            x = x - (text_width // 2)
        
        draw.text((x, y), name, font=font, fill=color)
        
        # Save to bytes
        img_byte_arr = io.BytesIO()
        certificate.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        return img_byte_arr
    except Exception as e:
        print(f"Error generating certificate: {e}")
        import traceback
        traceback.print_exc()
        return None

@app.post('/api/py/certificate')
async def get_certificate(request: Request):
    try:
        data = await request.json()
        reg_number = data.get('reg_number')
        name = data.get('name')  # Get name from request
        
        if not reg_number:
            return JSONResponse({"error": "Registration number is required"}, status_code=400)
        
        if not name:
            return JSONResponse({"error": "Name is required"}, status_code=400)
        
        print(f"Searching for reg_number: {reg_number}")
        print(f"Name provided: {name}")
        
        # Try to find participant in all configured events (CSV-based)
        for event_name, config in CERTIFICATE_CONFIGS.items():
            if event_name == "default":
                continue
                
            csv_path = f"api/assets/{event_name}/data.csv"
            if not os.path.exists(csv_path):
                print(f"CSV not found: {csv_path}")
                continue
                
            participants = load_csv_data(csv_path)
            print(f"Loaded {len(participants)} participants from {event_name}")
            
            # Check if registration number exists in CSV
            participant = next(
                (p for p in participants if p.get('reg_number', '').strip().upper() == reg_number.strip().upper()),
                None
            )
            
            if participant:
                print(f"Found reg_number in {event_name}")
                # Use the name provided by user, not from CSV
                
                # Generate certificate with the matched event config
                certificate_image = generate_certificate_with_config(
                    name, config, 0, 0
                )
                
                if certificate_image:
                    return StreamingResponse(
                        certificate_image,
                        media_type='image/png',
                        headers={
                            'Content-Disposition': f'attachment; filename=certificate_{reg_number}.png'
                        }
                    )
        
        # Fallback to old JSON-based system for legacy events
        print("Checking old system...")
        try:
            data2_path = "api/assets/data2.json"
            if os.path.exists(data2_path):
                with open(data2_path, "r") as file:
                    users_data = json.load(file)
                
                user_entry = next(
                    (user for user in users_data if user.get("reg_number", "").strip().upper() == reg_number.strip().upper()),
                    None
                )
                
                if user_entry:
                    print(f"Found in old system")
                    # For old system, use the name from user input as well
                    
                    # Use default config for old system
                    config = CERTIFICATE_CONFIGS["default"]
                    certificate_image = generate_certificate_with_config(name, config, 0, 0)
                    
                    if certificate_image:
                        return StreamingResponse(
                            certificate_image,
                            media_type='image/png',
                            headers={
                                'Content-Disposition': f'attachment; filename=certificate_{reg_number}.png'
                            }
                        )
        except Exception as e:
            print(f"Error checking old system: {e}")
        
        print("Participant not found in any system")
        return JSONResponse(
            {"error": f"Registration number '{reg_number}' not found. Please check your registration number."},
            status_code=404
        )
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            {"error": f"Internal server error: {str(e)}"},
            status_code=500
        )

@app.get('/api/events')
async def get_events():
    """Get list of available events"""
    events = list(CERTIFICATE_CONFIGS.keys())
    return JSONResponse({"events": events})

@app.post('/api/verify-participant')
async def verify_participant(request: Request):
    """Verify if participant exists for an event"""
    try:
        data = await request.json()
        reg_number = data.get('reg_number')
        event = data.get('event', 'default')
        
        if event in CERTIFICATE_CONFIGS and event != "default":
            csv_path = f"api/assets/{event}/data.csv"
            participants = load_csv_data(csv_path)
            
            participant = next(
                (p for p in participants if p.get('reg_number') == reg_number),
                None
            )
            
            if participant:
                return JSONResponse({
                    "exists": True,
                    "name": participant.get('name'),
                    "event": event
                })
        
        # Check old system
        # ...existing verification code...
        
        return JSONResponse({"exists": False}, status_code=404)
        
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
