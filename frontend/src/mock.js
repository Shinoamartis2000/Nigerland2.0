// Mock data for Nigerland Consult Limited

export const conferences2026 = [
  {
    id: 1,
    title: "TAX CONFERENCE",
    date: "January 15 & 16, 2026",
    fee: "₦146,000",
    description: "Comprehensive tax planning and compliance strategies",
    forWhom: "Tax professionals, accountants, business owners"
  },
  {
    id: 2,
    title: "INSURGENCY & SECURITY CONFERENCE",
    date: "March 19-20, 2026",
    fee: "Contact for pricing",
    description: "Security challenges and solutions for modern governance",
    forWhom: "Governments at all levels, Armed forces, Security Agencies, Institutions"
  },
  {
    id: 3,
    title: "SMART GOVERNMENT CONFERENCE",
    date: "May 22 & 23, 2026",
    fee: "₦259,000",
    description: "Digital transformation in government and public administration",
    forWhom: "Governments, public office seekers, public office holders, Administrators"
  },
  {
    id: 4,
    title: "NIGERIAN ECO CLIMATE CONFERENCE",
    date: "August 20-21, 2026",
    fee: "₦208,000",
    description: "Economic climate analysis and strategic planning",
    forWhom: "Economic experts, financial analysts and advisers, entrepreneurs"
  },
  {
    id: 5,
    title: "BUSINESS DEVELOPMENT CONFERENCE",
    date: "October 29 & 30, 2026",
    fee: "Contact for pricing",
    description: "Growth strategies and business optimization",
    forWhom: "Entrepreneurs, marketers, management experts, financial analysts"
  }
];

export const books = [
  {
    id: 1,
    title: "Nigeria's Hero Vol 1",
    image: "/assets/books/building courage.jpg",
    pdf: "/assets/books/Nigeria's hero Vol 1.pdf"
  },
  {
    id: 2,
    title: "Nigeria's Hero Vol 2",
    image: "/assets/books/salute to .jpg",
    pdf: "/assets/books/Nigeria's hero Vol 2 .pdf"
  },
  {
    id: 3,
    title: "The Good Nigerian",
    image: "/assets/books/the good nigerian.jpg",
    pdf: "/assets/books/the good nigerian.pdf"
  },
  {
    id: 4,
    title: "Yomi and the Three Thieves",
    image: "/assets/books/yomi.jpg",
    pdf: "/assets/books/yomi n d three thieves (4).pdf"
  },
  {
    id: 5,
    title: "Building Courage",
    image: "/assets/books/building courage.jpg"
  },
  {
    id: 6,
    title: "Never Again",
    image: "/assets/books/never again.jpg"
  },
  {
    id: 7,
    title: "The Generations",
    image: "/assets/books/the generations.jpg"
  },
  {
    id: 8,
    title: "The Quest",
    image: "/assets/books/the quest.jpg"
  },
  {
    id: 9,
    title: "The Tiger and Lion",
    image: "/assets/books/the tiger and lion.jpg"
  },
  {
    id: 10,
    title: "Three Feet Tall",
    image: "/assets/books/three feet tall.jpg"
  }
];

export const teamMembers = [
  {
    id: 1,
    name: "Kelechi Ngwaba",
    title: "Lead Consultant",
    credentials: "Fellow of the Institute of Chartered Accountants of Nigeria, Writer and Management Consultant",
    image: "/assets/team/kelechi.jpg",
    bio: "A distinguished professional with extensive experience in accounting, management consulting, and authorship."
  },
  {
    id: 2,
    name: "Uduak Nkanga Ngwaba",
    title: "Head of Logistics & Marketing",
    credentials: "Expert in Travel, Tours and Marketing Services",
    image: "/assets/team/uduak.jpg",
    bio: "Leading our logistics arm, providing first-class services in travels, tours and comprehensive marketing solutions."
  }
];

export const projects = [
  {
    id: 1,
    title: "NIGERLAND AT 25",
    description: "From October 2000 to Date, Nigerland has contributed immensely towards developing MEN and Creating Solutions. Nigerland hit 25 in October 2025 and the diverse family is set to celebrate her and her ideals. Prominent feature of this celebration is the humanitarian side which will be anchored by Nigerland books foundation.",
    year: "2000-2025"
  },
  {
    id: 2,
    title: "WHO'S WHO SERIES",
    description: "National and state wide publications on who's who is a unique upcoming project for Nigerland.",
    status: "Upcoming"
  }
];

export const businessModels = [
  {
    id: 1,
    name: "ALL CATCH ALL MODEL",
    description: "A management and marketing model designed to solve Business Place Problems (BPPs)",
    category: "Management & Marketing"
  },
  {
    id: 2,
    name: "CREATIVITY RATIO MODEL",
    description: "An applied creativity test model to measure employees creativity",
    category: "HR & Assessment"
  },
  {
    id: 3,
    name: "NIGERLAND RECRUITMENT GAMES MODEL (NRGM)",
    description: "Aimed at recommending first class personnel for organizations",
    category: "Recruitment"
  }
];

// Mock registration function
export const mockRegisterForConference = (data) => {
  console.log('Mock Registration:', data);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Registration submitted successfully!',
        registrationId: `REG${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      });
    }, 1000);
  });
};

// Mock contact form submission
export const mockSubmitContact = (data) => {
  console.log('Mock Contact:', data);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Message sent successfully!'
      });
    }, 1000);
  });
};