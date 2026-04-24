const mongoose = require('mongoose');

async function updateProfile() {
  await mongoose.connect('mongodb://localhost:27017/freelancer_marketplace');
  
  const result = await mongoose.connection.db.collection('users').updateOne(
    { email: 'aroragitanjali09@gmail.com' },
    {
      $set: {
        skills: ['React', 'Python', 'Express.js', 'Node.js', 'MongoDB'],
        bio: 'I am a full stack developer with 5 years of experience.',
        experience: '5+ years in web development. Worked on multiple React and Node.js projects.',
        hourlyRate: 50,
        role: 'freelancer'
      }
    }
  );
  
  console.log('Updated Gitanjali profile:', result.modifiedCount > 0 ? '✅ Success' : '⚠️ No changes');
  
  // Verify the update
  const user = await mongoose.connection.db.collection('users').findOne({ email: 'aroragitanjali09@gmail.com' });
  console.log('\n📋 Updated Profile:');
  console.log('Name:', user.name);
  console.log('Skills:', user.skills.join(', '));
  console.log('Hourly Rate: $' + user.hourlyRate);
  console.log('Bio:', user.bio);
  
  process.exit();
}

updateProfile();
