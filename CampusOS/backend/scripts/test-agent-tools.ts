import { executeTool } from '../src/agent/tools';
import { db } from '../src/config/database';

async function runTests() {
  console.log('====================================================');
  console.log('     CAMPUSOS AI AGENT — TOOL VERIFICATION SUITE    ');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(title: string, condition: boolean, details?: any) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${title}`);
      if (details) console.error('   Details:', details);
    }
  }

  try {
    // 1. Simple Lookup: Schedules on Wednesday
    console.log('\n--- 1. Testing Schedule Lookup (Wednesday) ---');
    const wedSchedules = await executeTool('get_schedules', { day: 'Wednesday' });
    assert('Fetched Wednesday schedules', wedSchedules.schedules?.length > 0, wedSchedules);
    console.log(`   Found ${wedSchedules.schedules?.length} classes on Wednesday.`);

    // 2. Simple Lookup: High Priority Announcements
    console.log('\n--- 2. Testing High Priority Announcements ---');
    const highAnnouncements = await executeTool('list_announcements', { priority: 'high' });
    assert('Fetched high priority announcements', highAnnouncements.announcements?.length > 0, highAnnouncements);
    console.log(`   Found ${highAnnouncements.announcements?.length} high priority announcements.`);

    // 3. Simple Lookup: Assignments
    console.log('\n--- 3. Testing Assignments ---');
    const assignments = await executeTool('list_assignments', {});
    assert('Fetched assignments', assignments.assignments?.length > 0, assignments);
    console.log(`   Found ${assignments.assignments?.length} assignments.`);

    // 4. Multi-Source: Labs with projector and capacity >= 30
    console.log('\n--- 4. Testing Lab Filter (Projector + Capacity >= 30) ---');
    const labResults = await executeTool('search_rooms', {
      type: 'lab',
      min_capacity: 30,
      equipment: 'projector',
    });
    assert('Found labs fitting criteria', labResults.rooms?.length > 0, labResults);
    console.log('   Matching labs:', labResults.rooms.map((r: any) => `${r.room_number} (cap: ${r.capacity})`));

    // 5. Multi-Source: Events lookup
    console.log('\n--- 5. Testing Events Lookup ---');
    const events = await executeTool('list_events', { search: 'Deep Learning' });
    assert('Found Deep Learning guest lecture', events.events?.length > 0, events);
    console.log('   Found event:', events.events[0]?.name);

    // 6. Action: Register for Event
    console.log('\n--- 6. Testing Event Registration ---');
    const testStudentId = 'TEST-' + Date.now().toString().slice(-4);
    const regResult = await executeTool('register_for_event', {
      event_name_or_id: 'Deep Learning',
      student_id: testStudentId,
      student_name: 'Imran Saleh',
    });
    assert('Event registration succeeded', regResult.success === true, regResult);
    console.log('   Registration message:', regResult.message);

    // 7. Action: Book Room 7A02
    console.log('\n--- 7. Testing Room Booking ---');
    const bookingDate = '2026-09-12';
    const bookResult = await executeTool('book_room', {
      room_number: '7A02',
      date: bookingDate,
      start_time: '15:00',
      end_time: '17:00',
      booked_by: 'Sakibul Hassan',
      purpose: 'Hackathon discussion',
    });
    assert('Room booking succeeded', bookResult.success === true, bookResult);
    console.log('   Booking confirmation:', bookResult.message);

    // 8. Conflict Detection: Try to book overlapping slot in same room
    console.log('\n--- 8. Testing Booking Conflict Prevention ---');
    const conflictResult = await executeTool('book_room', {
      room_number: '7A02',
      date: bookingDate,
      start_time: '16:00',
      end_time: '18:00',
      booked_by: 'Another Student',
      purpose: 'Conflicting meeting',
    });
    assert('Conflict was detected and blocked', conflictResult.success === false, conflictResult);
    console.log('   Conflict detected properly:', conflictResult.error);

    // 9. Availability Check: Room for 5 people with projector tomorrow between 2 and 4
    console.log('\n--- 9. Testing Room Availability Search for 5 people + projector ---');
    const availRooms = await executeTool('search_rooms', {
      min_capacity: 5,
      equipment: 'projector',
      date: '2026-09-05',
      start_time: '14:00',
      end_time: '16:00',
    });
    assert('Found room availability list', availRooms.rooms?.length > 0, availRooms);
    const freeRooms = availRooms.rooms.filter((r: any) => r.available);
    console.log(`   Found ${freeRooms.length} free rooms fitting criteria (out of ${availRooms.rooms.length} total).`);

    console.log('\n====================================================');
    console.log(`  VERIFICATION RESULTS: ${passed}/${total} TESTS PASSED  `);
    console.log('====================================================\n');
  } catch (err: any) {
    console.error('Test execution failed:', err);
  } finally {
    await db.pool.end();
  }
}

runTests();
