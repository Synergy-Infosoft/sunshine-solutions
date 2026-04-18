import pool from './src/config/db.js';

const titles = ['Paint Shop Helper', 'ITI Fitter', 'Welding Operator', 'Packing Helper', 'Electrician ITI', 'CNC Operator', 'Quality Inspector', 'Forklift Operator', 'Machine Helper', 'Store Keeper', 'Security Guard', 'Assembly Operator', 'Plumber', 'HVAC Technician', 'Molding Machine Operator', 'Turner / Machinist', 'Loading/Unloading Helper', 'Production Supervisor', 'Electrician Helper', 'Line Inspector'];
const states = ['Rajasthan', 'Maharashtra', 'Haryana', 'Tamil Nadu', 'Karnataka', 'UP', 'Delhi', 'Gujarat', 'West Bengal'];
const companies = ['Sunshine Auto', 'Heavy Machines Ltd', 'Steel Fabricators', 'Tech Assembly', 'Pro Logistics', 'BuildMax', 'National Industries'];
const types = ['Helper', 'ITI', 'Skilled'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  console.log('Generating 50 random jobs...');
  let count = 0;
  
  for (let i = 0; i < 50; i++) {
    const title = getRandomItem(titles);
    const company = getRandomItem(companies);
    const location = getRandomItem(states);
    const minSal = getRandomInt(10, 25) * 1000;
    const maxSal = minSal + getRandomInt(2, 6) * 1000;
    const salary = `${minSal} - ${maxSal}`;
    const type = getRandomItem(types);
    const featured = Math.random() > 0.7; // 30% urgent
    const posted_time = new Date(Date.now() - getRandomInt(0, 1000000000)).toISOString();
    
    // Add realistic dummy requirements & benefits based on probability
    const reqs = ['Minimum 10th Pass', 'Aadhaar Card mandatory', 'Physically fit'];
    const bens = ['pf', 'esic', 'food', 'room', 'overtime'].filter(() => Math.random() > 0.4);

    const description = `Urgent requirement for ${title} at ${company} in ${location}. Candidates must be reliable and ready to join immediately. Duty hours 8-12 hrs.`;

    await pool.execute(
      `INSERT INTO jobs (title, company, location, salary, type, posted_time, description, requirements, benefits, featured, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, company, location, salary, type, posted_time, description, JSON.stringify(reqs), JSON.stringify(bens), featured ? 1 : 0, 'active']
    );
    count++;
  }
  
  console.log(`Successfully generated and inserted ${count} jobs!`);
  process.exit(0);
}

seed();
