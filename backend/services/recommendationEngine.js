/**
 * AI-Based Recommendation Engine for Scholarship Compatibility
 * Evaluates a student's profile against scholarship eligibility criteria
 * using multi-factor weighted scoring.
 */

function calculateCompatibility(student, scholarship) {
  let score = 0;
  const breakdown = [];
  let isEligible = true;

  // 1. Academic Compatibility (Weight: 30)
  const minCGPA = scholarship.minimumCGPA || 0;
  const studentCGPA = student?.cgpa !== undefined ? Number(student.cgpa) : 7.0;

  if (minCGPA === 0) {
    score += 30;
    breakdown.push({
      factor: 'Academic (CGPA)',
      weight: 30,
      awarded: 30,
      status: 'MATCH',
      detail: `No minimum CGPA required. Current CGPA: ${studentCGPA}`,
    });
  } else if (studentCGPA >= minCGPA) {
    // Bonus for higher CGPA
    const meritSurplus = Math.min(5, (studentCGPA - minCGPA) * 2);
    const academicPoints = Math.min(30, 25 + meritSurplus);
    score += academicPoints;
    breakdown.push({
      factor: 'Academic (CGPA)',
      weight: 30,
      awarded: Math.round(academicPoints),
      status: 'MATCH',
      detail: `Exceeds minimum CGPA of ${minCGPA} (Your CGPA: ${studentCGPA})`,
    });
  } else {
    // Penalty if below minimum
    isEligible = false;
    const scaled = Math.max(0, Math.round((studentCGPA / minCGPA) * 15));
    score += scaled;
    breakdown.push({
      factor: 'Academic (CGPA)',
      weight: 30,
      awarded: scaled,
      status: 'DEFICIT',
      detail: `Below minimum CGPA requirement of ${minCGPA} (Your CGPA: ${studentCGPA})`,
    });
  }

  // 2. Financial Need Compatibility (Weight: 25)
  const maxIncome = scholarship.maximumFamilyIncome || 10000000;
  const studentIncome = student?.familyIncome !== undefined ? Number(student.familyIncome) : 300000;

  if (maxIncome >= 10000000) {
    score += 25;
    breakdown.push({
      factor: 'Financial Need',
      weight: 25,
      awarded: 25,
      status: 'MATCH',
      detail: `No family income restriction.`,
    });
  } else if (studentIncome <= maxIncome) {
    // Lower income gets full need-based weight
    score += 25;
    breakdown.push({
      factor: 'Financial Need',
      weight: 25,
      awarded: 25,
      status: 'MATCH',
      detail: `Family income ₹${studentIncome.toLocaleString('en-IN')} is within maximum ceiling of ₹${maxIncome.toLocaleString('en-IN')}`,
    });
  } else {
    // Exceeds income limit
    isEligible = false;
    const ratio = studentIncome / maxIncome;
    let awarded = 0;
    if (ratio < 1.2) {
      awarded = 10; // Marginal overshoot
    }
    score += awarded;
    breakdown.push({
      factor: 'Financial Need',
      weight: 25,
      awarded: awarded,
      status: 'DEFICIT',
      detail: `Family income ₹${studentIncome.toLocaleString('en-IN')} exceeds maximum limit of ₹${maxIncome.toLocaleString('en-IN')}`,
    });
  }

  // 3. Category / Reservation Match (Weight: 20)
  const applicableCategories = scholarship.applicableCategories || ['All'];
  const studentCategory = student?.category || 'General';

  const categoryMatches =
    applicableCategories.includes('All') ||
    applicableCategories.includes(studentCategory);

  if (categoryMatches) {
    score += 20;
    breakdown.push({
      factor: 'Category Eligibility',
      weight: 20,
      awarded: 20,
      status: 'MATCH',
      detail: `Category "${studentCategory}" is eligible (${applicableCategories.join(', ')})`,
    });
  } else {
    isEligible = false;
    breakdown.push({
      factor: 'Category Eligibility',
      weight: 20,
      awarded: 0,
      status: 'MISMATCH',
      detail: `Category "${studentCategory}" does not match scholarship criteria (${applicableCategories.join(', ')})`,
    });
  }

  // 4. Geographical / State Match (Weight: 10)
  const applicableStates = scholarship.applicableStates || ['All India'];
  const studentState = student?.state || 'Maharashtra';

  const stateMatches =
    applicableStates.includes('All India') ||
    applicableStates.includes('All') ||
    applicableStates.some((st) => st.toLowerCase() === studentState.toLowerCase());

  if (stateMatches) {
    score += 10;
    breakdown.push({
      factor: 'Geographical State',
      weight: 10,
      awarded: 10,
      status: 'MATCH',
      detail: `State "${studentState}" is eligible (${applicableStates.join(', ')})`,
    });
  } else {
    isEligible = false;
    breakdown.push({
      factor: 'Geographical State',
      weight: 10,
      awarded: 0,
      status: 'MISMATCH',
      detail: `State "${studentState}" is not covered (${applicableStates.join(', ')})`,
    });
  }

  // 5. Course / Discipline Match (Weight: 10)
  const eligibleCourses = scholarship.eligibleCourses || ['All Courses'];
  const studentCourse = student?.course || 'B.Tech';

  const courseMatches =
    eligibleCourses.includes('All Courses') ||
    eligibleCourses.includes('All') ||
    eligibleCourses.some(
      (c) =>
        c.toLowerCase().includes(studentCourse.toLowerCase()) ||
        studentCourse.toLowerCase().includes(c.toLowerCase())
    );

  if (courseMatches) {
    score += 10;
    breakdown.push({
      factor: 'Course & Discipline',
      weight: 10,
      awarded: 10,
      status: 'MATCH',
      detail: `Course "${studentCourse}" is eligible (${eligibleCourses.join(', ')})`,
    });
  } else {
    isEligible = false;
    breakdown.push({
      factor: 'Course & Discipline',
      weight: 10,
      awarded: 0,
      status: 'MISMATCH',
      detail: `Course "${studentCourse}" does not match required courses (${eligibleCourses.join(', ')})`,
    });
  }

  // 6. Special Inclusions (Gender, Minority, Disability) (Weight: 5)
  let specialPoints = 5;
  let specialNotes = [];

  // Gender check
  const genderReq = scholarship.genderRequirement || 'All';
  const studentGender = student?.gender || 'All';
  if (genderReq !== 'All' && genderReq.toLowerCase() !== studentGender.toLowerCase()) {
    specialPoints -= 2;
    isEligible = false;
    specialNotes.push(`Reserved for ${genderReq} applicants`);
  }

  // Minority check
  if (scholarship.minorityEligibleOnly && !student?.minorityStatus) {
    specialPoints -= 2;
    isEligible = false;
    specialNotes.push('Requires minority community status');
  }

  // Disability check
  if (scholarship.disabilityEligibleOnly && !student?.disabilityStatus) {
    specialPoints -= 2;
    isEligible = false;
    specialNotes.push('Reserved for differently-abled (PwD) candidates');
  }

  specialPoints = Math.max(0, specialPoints);
  score += specialPoints;
  breakdown.push({
    factor: 'Special Inclusions',
    weight: 5,
    awarded: specialPoints,
    status: specialPoints === 5 ? 'MATCH' : 'PARTIAL',
    detail: specialNotes.length > 0 ? specialNotes.join('; ') : 'All general demographic criteria met',
  });

  // Normalize final score between 0 and 100
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));

  // Determine Priority Ranking label
  let priorityRanking = 'Low Compatibility';
  let badgeColor = 'gray';

  if (normalizedScore >= 85) {
    priorityRanking = 'Top Match';
    badgeColor = 'emerald';
  } else if (normalizedScore >= 70) {
    priorityRanking = 'High Match';
    badgeColor = 'blue';
  } else if (normalizedScore >= 50) {
    priorityRanking = 'Eligible';
    badgeColor = 'amber';
  } else {
    priorityRanking = 'Competitive / Low Match';
    badgeColor = 'rose';
  }

  return {
    eligibilityPercentage: normalizedScore,
    recommendationScore: normalizedScore,
    isEligible,
    priorityRanking,
    badgeColor,
    breakdown,
  };
}

/**
 * Rank an array of scholarships for a student profile
 */
function rankScholarships(studentProfile, scholarships) {
  return scholarships
    .map((sch) => {
      const compatibility = calculateCompatibility(studentProfile, sch);
      return {
        ...sch.toObject ? sch.toObject() : sch,
        compatibility,
      };
    })
    .sort((a, b) => b.compatibility.recommendationScore - a.compatibility.recommendationScore);
}

module.exports = {
  calculateCompatibility,
  rankScholarships,
};
