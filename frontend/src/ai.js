import Vapi from "@vapi-ai/web";

export const vapi = new Vapi(import.meta.env.VITE_VAPI_API_KEY);

// Define assistant IDs for each expert
const EXPERT_ASSISTANT_IDS = {
  1: import.meta.env.VITE_ASSISTANT_ID_1, // Dr. Anitha Krishnan
  2: import.meta.env.VITE_ASSISTANT_ID_2, // Jason Brown
  3: import.meta.env.VITE_ASSISTANT_ID_3, // Priya Sharma
  4: import.meta.env.VITE_ASSISTANT_ID_4, // Alex Thompson
  5: import.meta.env.VITE_ASSISTANT_ID_5, // Dr. Emily Rodriguez
  6: import.meta.env.VITE_ASSISTANT_ID_6, // James Wilson
};

// Fallback assistant ID if expert-specific one is not available
const DEFAULT_ASSISTANT_ID = import.meta.env.VITE_ASSISTANT_ID_1;

export const startAssistant = async (userData, selectedExpert) => {
    // Get the appropriate assistant ID for the selected expert
    const assistantId = EXPERT_ASSISTANT_IDS[selectedExpert?.id] || DEFAULT_ASSISTANT_ID;
    
    console.log(`Using assistant ID for ${selectedExpert?.name}: ${assistantId}`);
    
    // Extract and prepare all user variables for VAPI
    const variableValues = {
        // Basic user info
        firstName: userData.name ? userData.name.split(' ')[0] : '',
        lastName: userData.name ? userData.name.split(' ').slice(1).join(' ') : '',
        name: userData.name || '',
        
        // Professional info
        currentJobRole: userData.current_job_role || '',
        yearsOfExperience: userData.years_of_experience || 0,
        industry: userData.industry || '',
        fieldOfStudy: userData.field_of_study || '',
        
        // Skills and interests
        skills: Array.isArray(userData.skills) ? userData.skills.join(', ') : (userData.skills || ''),
        topSkills: Array.isArray(userData.skills) ? userData.skills.slice(0, 3).join(', ') : (userData.skills || ''),
        skillsTop2: Array.isArray(userData.skills) ? userData.skills.slice(0, 2).join(' and ') : (userData.skills || ''),
        
        // Job interests
        interestedJobRoles: Array.isArray(userData.interested_job_roles) ? userData.interested_job_roles.join(', ') : (userData.interested_job_roles || ''),
        interestedJobRolesAnd: Array.isArray(userData.interested_job_roles) ? userData.interested_job_roles.join(' and ') : (userData.interested_job_roles || ''),
        primaryInterestedRole: Array.isArray(userData.interested_job_roles) ? userData.interested_job_roles[0] : (userData.interested_job_roles || 'Software Engineer'),
        
        // Additional info
        bio: userData.bio || '',
        headline: userData.headline || '',
        experienceDescription: userData.experience_description || '',
        
        // Expert info - pass selected expert details to the assistant
        expertName: selectedExpert?.name || '',
        expertRole: selectedExpert?.role || '',
        expertCompany: selectedExpert?.company || '',
        expertSpecialties: selectedExpert?.specialties ? selectedExpert.specialties.join(', ') : '',
        
        // Company info (you can make this dynamic later)
        companyName: selectedExpert?.company || 'TechCorp',
        
        // Legacy support for existing variables in your VAPI assistant
        'Company Name': selectedExpert?.company || 'TechCorp',
        Role: Array.isArray(userData.interested_job_roles) ? userData.interested_job_roles[0] : (userData.interested_job_roles || 'Software Engineer'),
        'skills.join(\', \')': Array.isArray(userData.skills) ? userData.skills.join(', ') : (userData.skills || ''),
        'skills.slice(0,3).join(\', \')': Array.isArray(userData.skills) ? userData.skills.slice(0, 3).join(', ') : (userData.skills || ''),
        'skills.slice(0,2).join(\' and \')': Array.isArray(userData.skills) ? userData.skills.slice(0, 2).join(' and ') : (userData.skills || ''),
        'interested_job_roles[0]': Array.isArray(userData.interested_job_roles) ? userData.interested_job_roles[0] : (userData.interested_job_roles || 'Software Engineer'),
        'interested_job_roles.join(\', \')': Array.isArray(userData.interested_job_roles) ? userData.interested_job_roles.join(', ') : (userData.interested_job_roles || ''),
        'interested_job_roles.join(\' and \')': Array.isArray(userData.interested_job_roles) ? userData.interested_job_roles.join(' and ') : (userData.interested_job_roles || '')
    };

    console.log('Starting assistant with user data:', {
        expertName: selectedExpert?.name,
        expertRole: selectedExpert?.role,
        userName: userData.name,
        userRole: userData.current_job_role,
        userExperience: userData.years_of_experience,
        userSkills: variableValues.skills,
        assistantId: assistantId
    });

    const assistantOverrides = {
        variableValues
    };

    try {
        const call = await vapi.start(assistantId, assistantOverrides);
        console.log('VAPI call started successfully:', call);
        return call;
    } catch (error) {
        console.error('Error starting VAPI assistant:', error);
        throw error;
    }
};

export const stopAssistant = () => {
    console.log('Stopping VAPI assistant...');
    vapi.stop();
};