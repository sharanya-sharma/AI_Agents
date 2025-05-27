const { Pool } = require('pg');

const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'AI_Bot',
    password: 'postgres',
    port: 5432,
});

db.connect()
  .then(() => {
    console.log('✅ DB connected successfully');
  })
  .catch((err) => {
    console.error('❌ DB connection error:', err.stack);
  });

const getUserData = async (userId) => {
    try {
        console.log(`🔍 Querying database for user ID: ${userId}`);
        
        const query = `
            SELECT name, skills, years_of_experience, current_job_role, experience_description,
                    field_of_study, headline, industry, bio, interested_job_roles
            FROM userinterviewprofile WHERE id = $1
        `;
        
        console.log('📝 Executing query:', query);
        console.log('📝 With parameter:', [userId]);
        
        const result = await db.query(query, [userId]);
        
        console.log('📊 Query result rows count:', result.rows.length);
        console.log('📊 Query result:', result.rows[0]);
        
        return result.rows[0];
    } catch (error) {
        console.error('❌ Error in getUserData function:', error);
        console.error('❌ Error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        throw error;
    }
};

const mapUserVariables = (userData, companyName = "TechCorp") => {
    try {
        console.log('🗺️ Mapping user variables for:', userData);
        
        // Handle skills - check if it's a string that needs parsing or already an array
        let skills = [];
        if (typeof userData.skills === 'string') {
            try {
                // Try to parse as JSON array first
                skills = JSON.parse(userData.skills);
            } catch {
                // If not JSON, split by comma
                skills = userData.skills.split(',').map(skill => skill.trim());
            }
        } else if (Array.isArray(userData.skills)) {
            skills = userData.skills;
        }

        // Handle interested job roles - same logic
        let interestedRoles = [];
        if (typeof userData.interested_job_roles === 'string') {
            try {
                // Try to parse as JSON array first
                interestedRoles = JSON.parse(userData.interested_job_roles);
            } catch {
                // If not JSON, split by comma
                interestedRoles = userData.interested_job_roles.split(',').map(role => role.trim());
            }
        } else if (Array.isArray(userData.interested_job_roles)) {
            interestedRoles = userData.interested_job_roles;
        }

        // Extract first name from full name
        const firstName = userData.name ? userData.name.split(' ')[0] : '';
            
        const mappedData = {
            firstName: firstName,
            name: userData.name || '',
            'Company Name': companyName,
            Role: interestedRoles[0] || 'Full Stack Engineer',
            current_job_role: userData.current_job_role || '',
            years_of_experience: userData.years_of_experience || 0,
            'skills.join(\', \')': skills.join(', '),
            'skills.slice(0,3).join(\', \')': skills.slice(0, 3).join(', '),
            'skills.slice(0,2).join(\' and \')': skills.slice(0, 2).join(' and '),
            'interested_job_roles[0]': interestedRoles[0] || 'Full Stack Engineer',
            'interested_job_roles.join(\', \')': interestedRoles.join(', '),
            'interested_job_roles.join(\' and \')': interestedRoles.join(' and '),
            field_of_study: userData.field_of_study || '',
            industry: userData.industry || '',
            bio: userData.bio || '',
            headline: userData.headline || '',
            experience_description: userData.experience_description || '',
            
            // Additional fields for better VAPI integration
            skills: skills, // Raw array
            interested_job_roles: interestedRoles // Raw array
        };
        
        console.log('✅ Successfully mapped user variables');
        return mappedData;
        
    } catch (error) {
        console.error('❌ Error in mapUserVariables function:', error);
        throw error;
    }
};

module.exports = {
    getUserData,
    mapUserVariables
};