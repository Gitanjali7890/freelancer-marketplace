const mongoose = require('mongoose');

async function checkBids() {
  await mongoose.connect('mongodb://localhost:27017/freelancer_marketplace');
  
  console.log('\n📊 All Bids in Database:');
  console.log('=======================');
  
  const bids = await mongoose.connection.db.collection('bids').find().toArray();
  
  if (bids.length === 0) {
    console.log('No bids found in database!');
  } else {
    for (const bid of bids) {
      console.log(`Project ID: ${bid.projectId}`);
      console.log(`Amount: $${bid.amount}`);
      console.log(`Status: ${bid.status}`);
      console.log('---');
    }
  }
  
  console.log('\n📋 All Projects:');
  console.log('================');
  const projects = await mongoose.connection.db.collection('projects').find().toArray();
  projects.forEach(p => {
    console.log(`${p.title} - Status: ${p.status} - ID: ${p._id}`);
  });
  
  process.exit();
}

checkBids();
