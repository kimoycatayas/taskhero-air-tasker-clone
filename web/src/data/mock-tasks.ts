// Mock task data with real coordinates for Brisbane/Davao area
// For demo purposes, using Brisbane area coordinates (can be changed to Davao)

export type Task = {
  id: string;
  title: string;
  budget: number;
  location: string;
  deadline: string;
  status: "open" | "assigned" | "completed";
  isRemote: boolean;
  isFlexible: boolean;
  offers?: number;
  posterAvatar?: string;
  postedBy: string;
  postedTime: string;
  details: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
};

export const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Surveyor to obtain building permit for shed",
    budget: 500,
    location: "Remote",
    deadline: "Flexible",
    status: "open",
    isRemote: true,
    isFlexible: true,
    offers: 0,
    posterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gedie",
    postedBy: "Gedie C.",
    postedTime: "12 minutes ago",
    details:
      "Surveyor to issue building permit for shed (7500mm x 3000mm x 2800mm high) including concrete slab according to Casey Council requirements in terms of distance from easements and property boundary fences.",
    coordinates: { lat: -27.4698, lng: 153.0251 }, // Brisbane CBD
  },
  {
    id: "2",
    title: "I need someone to look after two senior dogs in their home for 2 month",
    budget: 1200,
    location: "Redcliffe QLD",
    deadline: "On Fri, 12 Dec",
    status: "open",
    isRemote: false,
    isFlexible: false,
    offers: 2,
    posterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    postedBy: "Sarah M.",
    postedTime: "1 hour ago",
    details:
      "Looking for a caring and responsible person to look after my two senior dogs (12 and 14 years old) in their home for 2 months while I'm away. They need regular feeding, walks, and medication.",
    coordinates: { lat: -27.2308, lng: 153.1094 }, // Redcliffe
  },
  {
    id: "3",
    title: "Alterations to work pants",
    budget: 150,
    location: "South Brisbane QLD",
    deadline: "Before Fri, 19 Dec",
    status: "open",
    isRemote: false,
    isFlexible: false,
    offers: 0,
    posterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    postedBy: "John D.",
    postedTime: "2 hours ago",
    details:
      "Need alterations on 3 pairs of work pants. Hemming and taking in the waist slightly. Professional finish required.",
    coordinates: { lat: -27.4833, lng: 153.0167 }, // South Brisbane
  },
  {
    id: "4",
    title: "Family Lawyer Advice needed",
    budget: 20,
    location: "Remote",
    deadline: "Before Mon, 8 Dec",
    status: "open",
    isRemote: true,
    isFlexible: false,
    offers: 0,
    posterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    postedBy: "Maria S.",
    postedTime: "3 hours ago",
    details:
      "Need legal advice regarding family law matters. Quick consultation to understand my options and next steps.",
    coordinates: { lat: -27.4705, lng: 153.0260 }, // Brisbane
  },
  {
    id: "5",
    title: "UGC - How to use instructions for 2 x products",
    budget: 100,
    location: "Remote",
    deadline: "Today",
    status: "open",
    isRemote: true,
    isFlexible: false,
    offers: 0,
    posterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    postedBy: "Alex T.",
    postedTime: "4 hours ago",
    details:
      "Create user-generated content style how-to videos for 2 products. Should be natural, authentic, and easy to understand. Videos should be 30-60 seconds each.",
    coordinates: { lat: -27.4710, lng: 153.0235 }, // Brisbane
  },
  {
    id: "6",
    title: "Electrician needed to fit a new cooktop",
    budget: 250,
    location: "Redcliffe QLD",
    deadline: "On Mon, 8 Dec",
    status: "open",
    isRemote: false,
    isFlexible: false,
    offers: 0,
    posterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Peter",
    postedBy: "Peter K.",
    postedTime: "5 hours ago",
    details:
      "Need a licensed electrician to install a new cooktop in my kitchen. Must be able to work with 240V power and provide certification.",
    coordinates: { lat: -27.2285, lng: 153.1050 }, // Redcliffe
  },
  {
    id: "7",
    title: "Wordpress Expert",
    budget: 180,
    location: "Remote",
    deadline: "Before Mon, 8 Dec",
    status: "open",
    isRemote: true,
    isFlexible: false,
    offers: 3,
    posterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    postedBy: "Lisa W.",
    postedTime: "6 hours ago",
    details:
      "Looking for a WordPress expert to help customize my website theme and add some custom functionality. Experience with WooCommerce is a plus.",
    coordinates: { lat: -27.4650, lng: 153.0280 }, // Brisbane
  },
  {
    id: "8",
    title: "Help moving 4ft fish tank",
    budget: 70,
    location: "Morayfield QLD",
    deadline: "Tomorrow",
    status: "open",
    isRemote: false,
    isFlexible: false,
    offers: 0,
    posterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    postedBy: "Mike R.",
    postedTime: "7 hours ago",
    details:
      "Need help moving a 4ft fish tank to a new location. Must be careful and experienced with aquarium moves. Tank will be drained first.",
    coordinates: { lat: -27.1089, lng: 152.9503 }, // Morayfield
  },
  {
    id: "9",
    title: "Create me a custom work book",
    budget: 100,
    location: "Remote",
    deadline: "Before Fri, 12 Dec",
    status: "open",
    isRemote: true,
    isFlexible: false,
    offers: 3,
    posterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    postedBy: "Emma T.",
    postedTime: "8 hours ago",
    details:
      "Need someone to create a custom workbook/planner for my business. Should include goal-setting pages, weekly planners, and reflection sections.",
    coordinates: { lat: -27.4720, lng: 153.0280 }, // Brisbane
  },
  {
    id: "10",
    title: "Chop the olive tree and remove the soil bed",
    budget: 100,
    location: "Springfield Lakes QLD",
    deadline: "Flexible",
    status: "open",
    isRemote: false,
    isFlexible: true,
    offers: 0,
    posterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    postedBy: "David H.",
    postedTime: "9 hours ago",
    details:
      "Need help removing an old olive tree and the raised soil bed around it. Tree is about 2m tall. Must dispose of all waste properly.",
    coordinates: { lat: -27.6695, lng: 152.9197 }, // Springfield Lakes
  },
];



