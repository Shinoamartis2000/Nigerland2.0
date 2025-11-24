#!/usr/bin/env python3
"""
Test script to verify admin routes are working
"""

import sys
import os
sys.path.append('/app/backend')

from fastapi import FastAPI, APIRouter

# Set up environment
os.environ['MONGO_URL'] = 'mongodb://localhost:27017'
os.environ['DB_NAME'] = 'nigerland_db'

try:
    print("Testing admin routes import...")
    from routes_admin import router as admin_router
    print(f"✅ Admin router imported: {len(admin_router.routes)} routes")
    
    # List all routes
    print("\nAdmin routes:")
    for route in admin_router.routes:
        methods = list(route.methods) if hasattr(route, 'methods') else ['UNKNOWN']
        print(f"  {methods} {route.path}")
    
    # Create test app
    app = FastAPI()
    api_router = APIRouter(prefix="/api")
    api_router.include_router(admin_router)
    app.include_router(api_router)
    
    print(f"\n✅ App created with {len(app.routes)} total routes")
    
    # List app routes
    print("\nApp routes containing 'admin':")
    for route in app.routes:
        if hasattr(route, 'path') and 'admin' in route.path:
            print(f"  {route.path}")
        elif hasattr(route, 'routes'):  # For sub-routers
            for subroute in route.routes:
                if hasattr(subroute, 'path') and 'admin' in subroute.path:
                    methods = list(subroute.methods) if hasattr(subroute, 'methods') else ['UNKNOWN']
                    print(f"  {methods} {subroute.path}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()