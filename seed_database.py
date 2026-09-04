#!/usr/bin/env python3
"""
CampusOS Database Seeding Script
Loads JSON data files into PostgreSQL

Usage:
    python seed_database.py --host localhost --user postgres --password yourpassword --database campusos
"""

import json
import psycopg2
from psycopg2 import sql
import argparse
from pathlib import Path
from datetime import datetime

class CampusOSSeeder:
    def __init__(self, host, user, password, database, port=5432):
        self.conn = psycopg2.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            port=port
        )
        self.cursor = self.conn.cursor()
        self.data_dir = Path(__file__).parent / "data"
        
    def seed_schedules(self):
        """Load schedules from JSON"""
        print("📚 Seeding schedules...")
        with open(self.data_dir / "schedules.json") as f:
            schedules = json.load(f)
        
        for schedule in schedules:
            try:
                self.cursor.execute("""
                    INSERT INTO schedules 
                    (id, course, title, day, start_time, end_time, room, instructor, section)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET
                    course = EXCLUDED.course,
                    title = EXCLUDED.title,
                    day = EXCLUDED.day,
                    start_time = EXCLUDED.start_time,
                    end_time = EXCLUDED.end_time,
                    room = EXCLUDED.room,
                    instructor = EXCLUDED.instructor,
                    section = EXCLUDED.section,
                    updated_at = CURRENT_TIMESTAMP
                """, (
                    schedule['id'],
                    schedule['course'],
                    schedule['title'],
                    schedule['day'],
                    schedule['start_time'],
                    schedule['end_time'],
                    schedule['room'],
                    schedule.get('instructor', 'TBA'),
                    schedule.get('section', '')
                ))
            except Exception as e:
                print(f"❌ Error seeding schedule {schedule['id']}: {e}")
        
        self.conn.commit()
        print(f"✅ Loaded {len(schedules)} schedules")
    
    def seed_rooms(self):
        """Load rooms from JSON"""
        print("🏛️  Seeding rooms...")
        with open(self.data_dir / "rooms.json") as f:
            rooms = json.load(f)
        
        for room in rooms:
            try:
                # Insert room
                self.cursor.execute("""
                    INSERT INTO rooms 
                    (id, room_number, type, capacity, floor, status)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET
                    type = EXCLUDED.type,
                    capacity = EXCLUDED.capacity,
                    floor = EXCLUDED.floor,
                    status = EXCLUDED.status,
                    updated_at = CURRENT_TIMESTAMP
                """, (
                    room['id'],
                    room['room_number'],
                    room['type'],
                    room['capacity'],
                    room['floor'],
                    room['status']
                ))
                
                # Insert equipment
                for equipment in room.get('equipment', []):
                    self.cursor.execute("""
                        INSERT INTO room_equipment (room_id, equipment)
                        VALUES (%s, %s)
                        ON CONFLICT (room_id, equipment) DO NOTHING
                    """, (room['id'], equipment))
                
                # Insert bookings
                for booking in room.get('bookings', []):
                    self.cursor.execute("""
                        INSERT INTO room_bookings 
                        (booking_id, room_id, booked_by, booking_date, start_time, end_time, purpose, status)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, 'active')
                        ON CONFLICT (booking_id) DO UPDATE SET
                        booked_by = EXCLUDED.booked_by,
                        booking_date = EXCLUDED.booking_date,
                        start_time = EXCLUDED.start_time,
                        end_time = EXCLUDED.end_time,
                        purpose = EXCLUDED.purpose,
                        updated_at = CURRENT_TIMESTAMP
                    """, (
                        booking['booking_id'],
                        room['id'],
                        booking['booked_by'],
                        booking['date'],
                        booking['start_time'],
                        booking['end_time'],
                        booking.get('purpose', '')
                    ))
            except Exception as e:
                print(f"❌ Error seeding room {room['id']}: {e}")
        
        self.conn.commit()
        print(f"✅ Loaded {len(rooms)} rooms with equipment and bookings")
    
    def seed_events(self):
        """Load events from JSON"""
        print("🎉 Seeding events...")
        with open(self.data_dir / "events.json") as f:
            events = json.load(f)
        
        for event in events:
            try:
                # Insert event
                self.cursor.execute("""
                    INSERT INTO events 
                    (id, name, description, start_date, start_time, end_time, end_date, 
                     venue, organizer, capacity, registered, status)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    description = EXCLUDED.description,
                    start_date = EXCLUDED.start_date,
                    start_time = EXCLUDED.start_time,
                    end_time = EXCLUDED.end_time,
                    end_date = EXCLUDED.end_date,
                    venue = EXCLUDED.venue,
                    organizer = EXCLUDED.organizer,
                    capacity = EXCLUDED.capacity,
                    registered = EXCLUDED.registered,
                    status = EXCLUDED.status,
                    updated_at = CURRENT_TIMESTAMP
                """, (
                    event['id'],
                    event['name'],
                    event.get('description', ''),
                    event['date'],
                    event['start_time'],
                    event['end_time'],
                    event['end_date'],
                    event['venue'],
                    event['organizer'],
                    event['capacity'],
                    event['registered'],
                    event['status']
                ))
                
                # Insert registrations
                for registration in event.get('registrations', []):
                    self.cursor.execute("""
                        INSERT INTO event_registrations 
                        (event_id, student_id, student_name)
                        VALUES (%s, %s, %s)
                        ON CONFLICT (event_id, student_id) DO NOTHING
                    """, (
                        event['id'],
                        registration['student_id'],
                        registration['name']
                    ))
            except Exception as e:
                print(f"❌ Error seeding event {event['id']}: {e}")
        
        self.conn.commit()
        print(f"✅ Loaded {len(events)} events with registrations")
    
    def seed_announcements(self):
        """Load announcements from JSON"""
        print("📢 Seeding announcements...")
        with open(self.data_dir / "announcements.json") as f:
            announcements = json.load(f)
        
        for ann in announcements:
            try:
                # Determine status based on expiry date
                expires_date = datetime.strptime(ann['expires'], '%Y-%m-%d').date()
                status = 'expired' if expires_date < datetime.now().date() else 'active'
                
                self.cursor.execute("""
                    INSERT INTO announcements 
                    (id, title, body, announcement_date, priority, posted_by, expires_date, status)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET
                    title = EXCLUDED.title,
                    body = EXCLUDED.body,
                    announcement_date = EXCLUDED.announcement_date,
                    priority = EXCLUDED.priority,
                    posted_by = EXCLUDED.posted_by,
                    expires_date = EXCLUDED.expires_date,
                    status = EXCLUDED.status,
                    updated_at = CURRENT_TIMESTAMP
                """, (
                    ann['id'],
                    ann['title'],
                    ann['body'],
                    ann['date'],
                    ann['priority'],
                    ann['posted_by'],
                    ann['expires'],
                    status
                ))
            except Exception as e:
                print(f"❌ Error seeding announcement {ann['id']}: {e}")
        
        self.conn.commit()
        print(f"✅ Loaded {len(announcements)} announcements")
    
    def seed_assignments(self):
        """Load assignments from JSON"""
        print("📝 Seeding assignments...")
        with open(self.data_dir / "assignments.json") as f:
            assignments = json.load(f)
        
        for asgn in assignments:
            try:
                self.cursor.execute("""
                    INSERT INTO assignments 
                    (id, course, course_title, title, description, assigned_date, 
                     deadline, submission_platform, status, marks)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET
                    course = EXCLUDED.course,
                    course_title = EXCLUDED.course_title,
                    title = EXCLUDED.title,
                    description = EXCLUDED.description,
                    assigned_date = EXCLUDED.assigned_date,
                    deadline = EXCLUDED.deadline,
                    submission_platform = EXCLUDED.submission_platform,
                    status = EXCLUDED.status,
                    marks = EXCLUDED.marks,
                    updated_at = CURRENT_TIMESTAMP
                """, (
                    asgn['id'],
                    asgn['course'],
                    asgn['course_title'],
                    asgn['title'],
                    asgn.get('description', ''),
                    asgn['assigned_date'],
                    asgn['deadline'],
                    asgn.get('submission_platform', ''),
                    asgn['status'],
                    asgn.get('marks', 0)
                ))
            except Exception as e:
                print(f"❌ Error seeding assignment {asgn['id']}: {e}")
        
        self.conn.commit()
        print(f"✅ Loaded {len(assignments)} assignments")
    
    def seed_all(self):
        """Seed all data"""
        print("\n🚀 Starting CampusOS Database Seeding...\n")
        
        try:
            self.seed_schedules()
            self.seed_rooms()
            self.seed_events()
            self.seed_announcements()
            self.seed_assignments()
            
            print("\n✅ Database seeding completed successfully!")
            print("📊 Run this query to check: SELECT COUNT(*) FROM schedules, rooms, events, announcements, assignments;")
        
        except Exception as e:
            print(f"\n❌ Fatal error during seeding: {e}")
            self.conn.rollback()
        
        finally:
            self.cursor.close()
            self.conn.close()

def main():
    parser = argparse.ArgumentParser(description='Seed CampusOS database with JSON data')
    parser.add_argument('--host', default='localhost', help='Database host')
    parser.add_argument('--user', default='postgres', help='Database user')
    parser.add_argument('--password', default='postgres', help='Database password')
    parser.add_argument('--database', default='campusos', help='Database name')
    parser.add_argument('--port', type=int, default=5432, help='Database port')
    
    args = parser.parse_args()
    
    seeder = CampusOSSeeder(
        host=args.host,
        user=args.user,
        password=args.password,
        database=args.database,
        port=args.port
    )
    
    seeder.seed_all()

if __name__ == '__main__':
    main()
