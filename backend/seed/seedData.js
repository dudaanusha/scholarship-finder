const mongoose = require('mongoose');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Scholarship = require('../models/Scholarship');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const connectDB = require('../config/db');
require('dotenv').config();

const scholarshipsData = [
  {
    scholarshipName: 'Post-Matric Scholarship Scheme for OBC Students',
    providerOrganization: 'Ministry of Social Justice and Empowerment, Govt. of India',
    description: 'Provides financial support to Other Backward Classes (OBC) students studying at post-matriculation or post-secondary stages to enable them to complete their higher education.',
    eligibilityCriteria: 'Candidate must belong to OBC category. Family income must not exceed ₹2,50,000 per annum. Minimum 60% marks or 6.5 CGPA in previous examination.',
    minimumCGPA: 6.5,
    maximumFamilyIncome: 250000,
    applicableCategories: ['OBC'],
    applicableStates: ['All India'],
    eligibleCourses: ['All Courses', 'B.Tech', 'B.Sc', 'B.Com', 'MBBS', 'M.Tech'],
    scholarshipAmount: 75000,
    amountType: 'Per Annum',
    deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // In 6 days (triggers 7-day reminder!)
    applicationLink: 'https://scholarships.gov.in',
    scholarshipType: 'Government',
    requiredDocuments: ['Caste Certificate', 'Income Certificate', 'Marksheets', 'Aadhaar Card', 'Fee Receipt', 'Bank Passbook'],
    genderRequirement: 'All',
    minorityEligibleOnly: false,
    disabilityEligibleOnly: false,
    viewsCount: 1420,
    applicationsCount: 380,
  },
  {
    scholarshipName: 'Reliance Foundation Undergraduate Scholarship',
    providerOrganization: 'Reliance Foundation',
    description: 'Aims to support meritorious undergraduate students across India to continue their education, access mentors, and develop leadership capabilities.',
    eligibilityCriteria: 'Resident Indian citizen enrolled in 1st year of full-time undergraduate degree program. Household income less than ₹15,00,000 (preference under ₹2,50,000). Aptitude test mandatory.',
    minimumCGPA: 7.5,
    maximumFamilyIncome: 1500000,
    applicableCategories: ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'],
    applicableStates: ['All India'],
    eligibleCourses: ['All Courses', 'B.Tech', 'B.Sc', 'B.Com', 'MBBS'],
    scholarshipAmount: 200000,
    amountType: 'Full Duration Grant',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days (triggers 3-day reminder!)
    applicationLink: 'https://www.reliancefoundation.org',
    scholarshipType: 'Private',
    requiredDocuments: ['Class 12 Marksheet', 'College Admission Letter', 'Income Certificate', 'Government ID Proof'],
    genderRequirement: 'All',
    minorityEligibleOnly: false,
    disabilityEligibleOnly: false,
    viewsCount: 2890,
    applicationsCount: 840,
  },
  {
    scholarshipName: 'AICTE Pragati Scholarship for Girls',
    providerOrganization: 'All India Council for Technical Education (AICTE)',
    description: 'Empowering young women to pursue technical education in AICTE-approved degree colleges across the country.',
    eligibilityCriteria: 'Female candidates admitted to 1st year of degree technical course. Maximum two girl children per family. Family income below ₹8,00,000 per annum.',
    minimumCGPA: 6.0,
    maximumFamilyIncome: 800000,
    applicableCategories: ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'],
    applicableStates: ['All India'],
    eligibleCourses: ['B.Tech', 'Diploma', 'M.Tech'],
    scholarshipAmount: 50000,
    amountType: 'Per Annum',
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    applicationLink: 'https://www.aicte-india.org',
    scholarshipType: 'Government',
    requiredDocuments: ['AICTE College Bonafide', '10th and 12th Marksheets', 'Family Income Certificate', 'Aadhaar Card'],
    genderRequirement: 'Female',
    minorityEligibleOnly: false,
    disabilityEligibleOnly: false,
    viewsCount: 1950,
    applicationsCount: 620,
  },
  {
    scholarshipName: 'Tata Trusts Medical & Healthcare Higher Education Grant',
    providerOrganization: 'Tata Trusts',
    description: 'Financial assistance for deserving students pursuing MBBS and postgraduate medical sciences with proven academic dedication.',
    eligibilityCriteria: 'Enrolled in accredited medical college for MBBS or BDS. Minimum 7.0 CGPA / 65% aggregate. Family income below ₹6,00,000.',
    minimumCGPA: 7.0,
    maximumFamilyIncome: 600000,
    applicableCategories: ['All'],
    applicableStates: ['All India'],
    eligibleCourses: ['MBBS', 'BDS', 'B.Sc Nursing'],
    scholarshipAmount: 150000,
    amountType: 'Per Annum',
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    applicationLink: 'https://www.tatatrusts.org',
    scholarshipType: 'Merit-based',
    requiredDocuments: ['NEET Scorecard', 'Medical College Admission Bonafide', 'Income Certificate', 'Academic Records'],
    genderRequirement: 'All',
    minorityEligibleOnly: false,
    disabilityEligibleOnly: false,
    viewsCount: 1680,
    applicationsCount: 410,
  },
  {
    scholarshipName: 'Central Sector Scheme of Scholarships for College Students',
    providerOrganization: 'Department of Higher Education, MHRD',
    description: 'National scholarship awarded on the basis of results of Higher Secondary / Class 12 board examinations to support higher studies.',
    eligibilityCriteria: 'Students above 80th percentile in relevant board stream. Family income less than ₹4,50,000. Not availing any other scholarship.',
    minimumCGPA: 8.0,
    maximumFamilyIncome: 450000,
    applicableCategories: ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'],
    applicableStates: ['All India'],
    eligibleCourses: ['All Courses', 'B.Tech', 'B.Sc', 'B.Com', 'MBBS'],
    scholarshipAmount: 20000,
    amountType: 'Per Annum',
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    applicationLink: 'https://scholarships.gov.in',
    scholarshipType: 'Government',
    requiredDocuments: ['Class 12 Passing Certificate', 'Income Certificate', 'College Verification Form', 'Bank Passbook'],
    genderRequirement: 'All',
    minorityEligibleOnly: false,
    disabilityEligibleOnly: false,
    viewsCount: 3120,
    applicationsCount: 1200,
  },
  {
    scholarshipName: 'ONGC Foundation SC/ST Meritorious Scholarship',
    providerOrganization: 'ONGC Foundation',
    description: 'Dedicated scholarship scheme providing holistic financial encouragement to SC and ST students in Engineering, MBBS, and MBA disciplines.',
    eligibilityCriteria: 'Candidate must belong to SC or ST community. Enrolled in 1st year Engineering/MBBS/MBA. Minimum 60% in Class 12. Income under ₹4,50,000.',
    minimumCGPA: 6.0,
    maximumFamilyIncome: 450000,
    applicableCategories: ['SC', 'ST'],
    applicableStates: ['All India'],
    eligibleCourses: ['B.Tech', 'MBBS', 'MBA'],
    scholarshipAmount: 48000,
    amountType: 'Per Annum',
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow! (triggers 1-day reminder!)
    applicationLink: 'https://ongcscholar.org',
    scholarshipType: 'Government',
    requiredDocuments: ['Caste Certificate (SC/ST)', 'College Bonafide', 'Income Certificate', 'PAN & Aadhaar Card'],
    genderRequirement: 'All',
    minorityEligibleOnly: false,
    disabilityEligibleOnly: false,
    viewsCount: 1750,
    applicationsCount: 520,
  },
  {
    scholarshipName: 'Adobe India Women-in-Technology Scholarship',
    providerOrganization: 'Adobe Systems India',
    description: 'Recognizing outstanding female undergraduate and master students in computer science, software engineering, and data science.',
    eligibilityCriteria: 'Female student enrolled in B.Tech, M.Tech, Dual Degree in CS/IT. Excellent academic track record (CGPA > 8.0). Essay and coding challenge.',
    minimumCGPA: 8.0,
    maximumFamilyIncome: 10000000,
    applicableCategories: ['All'],
    applicableStates: ['All India'],
    eligibleCourses: ['B.Tech', 'M.Tech'],
    scholarshipAmount: 250000,
    amountType: 'One-time Grant',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    applicationLink: 'https://www.adobe.com/careers/university/india.html',
    scholarshipType: 'Private',
    requiredDocuments: ['Resume', 'Academic Transcripts', 'Recommendation Letter', 'Statement of Purpose'],
    genderRequirement: 'Female',
    minorityEligibleOnly: false,
    disabilityEligibleOnly: false,
    viewsCount: 4200,
    applicationsCount: 950,
  },
  {
    scholarshipName: 'Maharashtra State Merit Scholarship for Higher Education',
    providerOrganization: 'Government of Maharashtra (MahaDBT)',
    description: 'State government merit scholarship for domiciled students of Maharashtra pursuing higher professional degree courses in state universities.',
    eligibilityCriteria: 'Domicile of Maharashtra. Minimum 7.5 CGPA in previous academic year. Enrolled in approved college within Maharashtra.',
    minimumCGPA: 7.5,
    maximumFamilyIncome: 800000,
    applicableCategories: ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'],
    applicableStates: ['Maharashtra'],
    eligibleCourses: ['All Courses', 'B.Tech', 'B.Sc', 'B.Com', 'MBBS', 'M.Tech'],
    scholarshipAmount: 60000,
    amountType: 'Per Annum',
    deadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    applicationLink: 'https://mahadbt.maharashtra.gov.in',
    scholarshipType: 'Government',
    requiredDocuments: ['Maharashtra Domicile Certificate', 'College ID', 'Income Certificate', 'Caste Certificate (if applicable)'],
    genderRequirement: 'All',
    minorityEligibleOnly: false,
    disabilityEligibleOnly: false,
    viewsCount: 2100,
    applicationsCount: 710,
  },
  {
    scholarshipName: 'HDFC Bank Parivartan Educational Crisis Support Scholarship',
    providerOrganization: 'HDFC Bank Parivartan',
    description: 'Aimed at students facing sudden personal or financial contingencies, helping prevent drop-outs across colleges and universities.',
    eligibilityCriteria: 'Facing financial crisis or loss of earning member. Family annual income less than or equal to ₹2,50,000. Minimum 55% marks in previous exam.',
    minimumCGPA: 5.5,
    maximumFamilyIncome: 250000,
    applicableCategories: ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'],
    applicableStates: ['All India'],
    eligibleCourses: ['All Courses', 'B.Tech', 'B.Sc', 'B.Com', 'MBA', 'Diploma'],
    scholarshipAmount: 75000,
    amountType: 'Per Annum',
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    applicationLink: 'https://www.hdfcbank.com/parivartan',
    scholarshipType: 'Need-based',
    requiredDocuments: ['Crisis Proof Document', 'Income Certificate', 'Previous Year Marksheet', 'College Fee Receipt'],
    genderRequirement: 'All',
    minorityEligibleOnly: false,
    disabilityEligibleOnly: false,
    viewsCount: 3540,
    applicationsCount: 1140,
  },
  {
    scholarshipName: 'Google Generation Scholarship (Asia Pacific)',
    providerOrganization: 'Google',
    description: 'Designed to inspire and help students pursuing computer science degrees excel in technology and become active role models and leaders.',
    eligibilityCriteria: 'Currently enrolled as a full-time undergraduate student in CS, Computer Engineering, or related technical field. Strong academic performance.',
    minimumCGPA: 8.5,
    maximumFamilyIncome: 10000000,
    applicableCategories: ['All'],
    applicableStates: ['All India'],
    eligibleCourses: ['B.Tech', 'B.Sc', 'M.Tech'],
    scholarshipAmount: 200000,
    amountType: 'One-time Grant',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    applicationLink: 'https://buildyourfuture.withgoogle.com/scholarships',
    scholarshipType: 'Merit-based',
    requiredDocuments: ['Updated Resume', 'Academic Transcripts', 'Responses to 2 Short Essay Questions'],
    genderRequirement: 'Female',
    minorityEligibleOnly: false,
    disabilityEligibleOnly: false,
    viewsCount: 5120,
    applicationsCount: 1420,
  },
  {
    scholarshipName: 'National Fellowship for Persons with Disabilities (NFPwD)',
    providerOrganization: 'Department of Empowerment of Persons with Disabilities',
    description: 'Offers fellowships to differently-abled students for pursuing technical, professional, and higher research studies (M.Phil / PhD / Post-Graduate).',
    eligibilityCriteria: 'Candidate must have minimum 40% disability certificate. Enrolled in recognized university or institute for higher education.',
    minimumCGPA: 5.0,
    maximumFamilyIncome: 600000,
    applicableCategories: ['All'],
    applicableStates: ['All India'],
    eligibleCourses: ['All Courses', 'B.Tech', 'M.Tech', 'MBA', 'PhD'],
    scholarshipAmount: 120000,
    amountType: 'Per Annum',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    applicationLink: 'https://disabilityaffairs.gov.in',
    scholarshipType: 'Special Category',
    requiredDocuments: ['Disability Certificate (UDID)', 'University Admission Slip', 'Income Certificate', 'Aadhaar Card'],
    genderRequirement: 'All',
    minorityEligibleOnly: false,
    disabilityEligibleOnly: true,
    viewsCount: 980,
    applicationsCount: 220,
  },
  {
    scholarshipName: 'Maulana Azad National Scholarship for Minority Students',
    providerOrganization: 'Ministry of Minority Affairs',
    description: 'Providing educational financial support to meritorious students belonging to notified minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi).',
    eligibilityCriteria: 'Belong to notified minority community. Minimum 55% marks in previous exam. Annual family income not exceeding ₹2,50,000.',
    minimumCGPA: 5.5,
    maximumFamilyIncome: 250000,
    applicableCategories: ['All'],
    applicableStates: ['All India'],
    eligibleCourses: ['All Courses', 'B.Tech', 'B.Sc', 'B.Com', 'MBBS'],
    scholarshipAmount: 50000,
    amountType: 'Per Annum',
    deadline: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
    applicationLink: 'https://scholarships.gov.in',
    scholarshipType: 'Minority',
    requiredDocuments: ['Minority Community Self-Declaration', 'Income Certificate', 'Marksheet', 'Bank Details'],
    genderRequirement: 'All',
    minorityEligibleOnly: true,
    disabilityEligibleOnly: false,
    viewsCount: 1450,
    applicationsCount: 480,
  },
  {
    scholarshipName: 'Sitaram Jindal Foundation Scholarship Scheme',
    providerOrganization: 'Sitaram Jindal Foundation',
    description: 'Provides merit-cum-means scholarships to students from lower economic strata pursuing degree and professional diplomas.',
    eligibilityCriteria: 'Minimum 65% for boys and 60% for girls in previous exam. Family income limit ₹2,50,000 (for employment) or ₹4,00,000 (agriculture).',
    minimumCGPA: 6.5,
    maximumFamilyIncome: 300000,
    applicableCategories: ['All'],
    applicableStates: ['All India'],
    eligibleCourses: ['All Courses', 'B.Tech', 'B.Sc', 'B.Com', 'Diploma'],
    scholarshipAmount: 36000,
    amountType: 'Per Annum',
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    applicationLink: 'https://www.sitaramjindalfoundation.org',
    scholarshipType: 'Need-based',
    requiredDocuments: ['SSLC/HSC Marks Card', 'Income Certificate', 'College Principal Endorsement', 'Fee Receipt'],
    genderRequirement: 'All',
    minorityEligibleOnly: false,
    disabilityEligibleOnly: false,
    viewsCount: 2280,
    applicationsCount: 760,
  },
  {
    scholarshipName: 'Karnataka Post-Matric EWS / SC / ST Higher Education Award',
    providerOrganization: 'Social Welfare Department, Government of Karnataka',
    description: 'State government initiative for Karnataka students pursuing undergraduate and postgraduate engineering and medical degrees.',
    eligibilityCriteria: 'Karnataka resident. Student category SC/ST or EWS. Enrolled in accredited Karnataka university.',
    minimumCGPA: 6.0,
    maximumFamilyIncome: 300000,
    applicableCategories: ['SC', 'ST', 'EWS'],
    applicableStates: ['Karnataka'],
    eligibleCourses: ['B.Tech', 'MBBS', 'B.Sc', 'M.Tech'],
    scholarshipAmount: 85000,
    amountType: 'Per Annum',
    deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    applicationLink: 'https://ssp.postmatric.karnataka.gov.in',
    scholarshipType: 'Government',
    requiredDocuments: ['Karnataka Domicile Certificate', 'SSP Student ID', 'Caste/Income Certificate', 'College ID Card'],
    genderRequirement: 'All',
    minorityEligibleOnly: false,
    disabilityEligibleOnly: false,
    viewsCount: 1320,
    applicationsCount: 390,
  },
  {
    scholarshipName: 'Kotak Kanya Scholarship for Girl Students',
    providerOrganization: 'Kotak Education Foundation',
    description: 'Collaborative initiative providing financial assistance to meritorious girl students from low-income families to pursue professional graduation.',
    eligibilityCriteria: 'Girl students who scored 85% or more marks in 12th Board examinations and secured admission in 1st year professional degree (Engineering, MBBS, Architecture, Law). Income under ₹6,00,000.',
    minimumCGPA: 8.5,
    maximumFamilyIncome: 600000,
    applicableCategories: ['All'],
    applicableStates: ['All India'],
    eligibleCourses: ['B.Tech', 'MBBS', 'B.Arch'],
    scholarshipAmount: 150000,
    amountType: 'Per Annum',
    deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    applicationLink: 'https://kotak.kotakeducation.org',
    scholarshipType: 'Private',
    requiredDocuments: ['Class 12 Marksheet', 'College Admission Letter', 'Income Certificate', 'Bank Details'],
    genderRequirement: 'Female',
    minorityEligibleOnly: false,
    disabilityEligibleOnly: false,
    viewsCount: 2650,
    applicationsCount: 780,
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Checking / Seeding Initial Dataset (Non-Destructive)...');

    // DO NOT clear existing data - preserving all user accounts and applications permanently

    // 1. Ensure Admin User exists
    let adminUser = await User.findOne({ email: 'admin@scholarship.org' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Platform Administrator',
        email: 'admin@scholarship.org',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Admin user created: admin@scholarship.org / admin123');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }

    // 2. Ensure Sample Student User exists (Aarav Sharma)
    let studentUser = await User.findOne({ email: 'student@scholarship.org' });
    if (!studentUser) {
      studentUser = await User.create({
        name: 'Aarav Sharma',
        email: 'student@scholarship.org',
        password: 'student123',
        role: 'student',
      });
      console.log('✅ Sample student user created: student@scholarship.org / student123');
    } else {
      console.log('ℹ️ Sample student user already exists.');
    }

    // 3. Ensure Student Profile for Aarav Sharma
    let studentProfile = await StudentProfile.findOne({ userId: studentUser._id });
    if (!studentProfile) {
      studentProfile = await StudentProfile.create({
        userId: studentUser._id,
        fullName: 'Aarav Sharma',
        email: 'student@scholarship.org',
        mobileNumber: '9876543210',
        gender: 'Male',
        dateOfBirth: new Date('2003-08-15'),
        state: 'Maharashtra',
        district: 'Pune',
        course: 'B.Tech',
        branch: 'Computer Science and Engineering',
        yearOfStudy: '3rd Year',
        collegeName: 'Pune Institute of Computer Technology',
        cgpa: 8.7,
        familyIncome: 240000, // ₹2,40,000 / year
        category: 'OBC',
        minorityStatus: false,
        disabilityStatus: false,
      });
      console.log('✅ Student Profile created for Aarav Sharma (CGPA: 8.7, Income: 2.4L, OBC, Maharashtra, B.Tech)');
    }

    // 4. Ensure Additional Diverse Student Profiles for Analytics
    const additionalStudents = [
      {
        name: 'Priya Patel',
        email: 'priya.patel@example.com',
        state: 'Gujarat',
        course: 'MBBS',
        branch: 'General Medicine',
        cgpa: 9.2,
        familyIncome: 450000,
        category: 'General',
        gender: 'Female',
      },
      {
        name: 'Rahul Verma',
        email: 'rahul.verma@example.com',
        state: 'Uttar Pradesh',
        course: 'B.Tech',
        branch: 'Mechanical Engineering',
        cgpa: 7.5,
        familyIncome: 180000,
        category: 'SC',
        gender: 'Male',
      },
      {
        name: 'Fatima Sheikh',
        email: 'fatima.sheikh@example.com',
        state: 'Karnataka',
        course: 'B.Sc',
        branch: 'Data Science',
        cgpa: 8.4,
        familyIncome: 210000,
        category: 'OBC',
        gender: 'Female',
        minorityStatus: true,
      },
      {
        name: 'Amit Kumar',
        email: 'amit.kumar@example.com',
        state: 'Bihar',
        course: 'B.Com',
        branch: 'Finance',
        cgpa: 6.8,
        familyIncome: 120000,
        category: 'EWS',
        gender: 'Male',
        disabilityStatus: true,
      },
    ];

    for (const stud of additionalStudents) {
      let u = await User.findOne({ email: stud.email });
      if (!u) {
        u = await User.create({
          name: stud.name,
          email: stud.email,
          password: 'password123',
          role: 'student',
        });
        await StudentProfile.create({
          userId: u._id,
          fullName: stud.name,
          email: stud.email,
          gender: stud.gender,
          state: stud.state,
          course: stud.course,
          branch: stud.branch,
          cgpa: stud.cgpa,
          familyIncome: stud.familyIncome,
          category: stud.category,
          minorityStatus: Boolean(stud.minorityStatus),
          disabilityStatus: Boolean(stud.disabilityStatus),
        });
      }
    }

    // 5. Insert Scholarships if none exist
    let totalScholarships = await Scholarship.countDocuments();
    let insertedScholarships = [];
    if (totalScholarships === 0) {
      insertedScholarships = await Scholarship.insertMany(scholarshipsData);
      console.log(`✅ Seeded ${insertedScholarships.length} comprehensive scholarships.`);
      totalScholarships = insertedScholarships.length;
    } else {
      console.log(`ℹ️ Scholarships collection already populated (${totalScholarships} items).`);
      insertedScholarships = await Scholarship.find().limit(10);
    }

    // 6. Pre-populate sample applications for Aarav Sharma if none exist
    const existingApps = await Application.countDocuments({ userId: studentUser._id });
    if (existingApps === 0 && insertedScholarships.length >= 8) {
      // Save Reliance Foundation
      await Application.create({
        userId: studentUser._id,
        scholarshipId: insertedScholarships[1]._id, // Reliance Foundation
        status: 'Saved',
      });

      // Apply for Post-Matric OBC
      const appApplied = await Application.create({
        userId: studentUser._id,
        scholarshipId: insertedScholarships[0]._id, // Post-Matric OBC
        status: 'Applied',
        appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        notes: 'Applied via National Scholarship Portal with income certificate and university bonafide.',
      });

      // Apply for Maharashtra State Merit (Under Review)
      await Application.create({
        userId: studentUser._id,
        scholarshipId: insertedScholarships[7]._id, // Maharashtra State Merit
        status: 'Under Review',
        appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        notes: 'All university verification stamps completed. Department review in progress.',
      });

      // 7. Seed Initial Notifications for Aarav Sharma
      await Notification.create({
        userId: studentUser._id,
        scholarshipId: insertedScholarships[1]._id,
        title: '3 Days Left to Apply',
        message: `Priority Alert: Only 2-3 days remaining to finalize your application for "${insertedScholarships[1].scholarshipName}".`,
        type: 'DEADLINE_REMINDER_3D',
        deadline: insertedScholarships[1].deadline,
        readStatus: false,
      });

      await Notification.create({
        userId: studentUser._id,
        scholarshipId: insertedScholarships[0]._id,
        title: 'Application Submitted',
        message: `Your application for "${insertedScholarships[0].scholarshipName}" has been successfully recorded. Tracking ID: ${appApplied.trackingNumber}`,
        type: 'APPLICATION_UPDATE',
        deadline: insertedScholarships[0].deadline,
        readStatus: true,
      });
    }

    console.log('🎉 Seed check successfully completed!');
    return {
      adminUser,
      studentUser,
      scholarshipsCount: totalScholarships,
    };
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
}

// If run directly via node seed/seedData.js
if (require.main === module) {
  connectDB().then(async () => {
    await seedDatabase();
    process.exit(0);
  });
}

module.exports = seedDatabase;
