const mongoose = require('mongoose');

async function checkAndUpdate() {
  try {
    await mongoose.connect('mongodb://localhost:27017/freelancer_marketplace');
    console.log('✅ Connected to MongoDB');
    
    // Update Gitanjali
    const updateResult = await mongoose.connection.db.collection('users').updateOne(
      { email: 'aroragitanjali09@gmail.com' },
      { 
        $set: { 
          skills: ['React', 'Python', 'Express.js', 'Node.js', 'MongoDB'],
          hourlyRate: 50,
          bio: 'I am a full stack developer with 5 years of experience.',
          experience: '5+ years in web development',
          role: 'freelancer'
        }
      }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log('✅ Gitanjali profile updated successfully!');
    } else if (updateResult.matchedCount > 0) {
      console.log('⚠️ User found but no changes needed');
    } else {
      console.log('❌ User not found with email: aroragitanjali09@gmail.com');
    }
    
    // Verify update
    const updated = await mongoose.connection.db.collection('users').findOne({ email: 'aroragitanjali09@gmail.com' });
    if (updated) {
      console.log('\n📋 Updated Profile:');
      console.log(`  Name: ${updated.name}`);
      console.log(`  Skills: ${updated.skills.join(', ')}`);
      console.log(`  Hourly Rate: $${updated.hourlyRate}`);
      console.log(`  Bio: ${updated.bio}`);
    }
    
    // Find all freelancers with React skill
    const reactFreelancers = await mongoose.connection.db.collection('users').find({
      role: 'freelancer',
      skills: { $in: ['React'] }
    }).toArray();
    
    console.log(`\n🔍 Freelancers with React skill: ${reactFreelancers.length}`);
    reactFreelancers.forEach(f => {
      console.log(`  - ${f.name}: ${f.skills.join(', ')}`);
    });
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit();
  }
}

checkAndUpdate();
