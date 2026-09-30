const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Genre = require("./models/Genre");
const Book = require("./models/Book");

const genreSeeds = [
  { name: "Science Fiction", slug: "science-fiction" },
  { name: "Fantasy", slug: "fantasy" },
  { name: "Mystery", slug: "mystery" },
  { name: "Historical Fiction", slug: "historical-fiction" },
  { name: "Romance", slug: "romance" },
];

const bookSeeds = [
  {
    title: "The Martian Chronicles",
    author: "Ray Bradbury",
    isbn: "978-0441172719",
    description: "A classic collection of science fiction stories about humanity's expansion to Mars and the emotional cost of exploration.",
    coverImage: "https://images.example.com/martian-chronicles.jpg",
    totalCopies: 8,
    availableCopies: 5,
    genre: "Science Fiction",
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    isbn: "978-0441013593",
    description: "An epic desert planet saga involving prophecy, politics, and survival on Arrakis.",
    coverImage: "https://images.example.com/dune.jpg",
    totalCopies: 10,
    availableCopies: 6,
    genre: "Science Fiction",
  },
  {
    title: "Neuromancer",
    author: "William Gibson",
    isbn: "978-0441569595",
    description: "A cyberpunk novel set in a gritty future where hackers, corporations, and artificial intelligence collide.",
    coverImage: "https://images.example.com/neuromancer.jpg",
    totalCopies: 7,
    availableCopies: 4,
    genre: "Science Fiction",
  },
  {
    title: "Foundation",
    author: "Isaac Asimov",
    isbn: "978-0553803716",
    description: "A mathematician and his disciples seek to preserve knowledge across a collapsing galactic empire.",
    coverImage: "https://images.example.com/foundation.jpg",
    totalCopies: 9,
    availableCopies: 7,
    genre: "Science Fiction",
  },
  {
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    isbn: "978-0756404741",
    description: "A gifted young musician recounts his extraordinary life and magical training in a richly imagined world.",
    coverImage: "https://images.example.com/name-of-the-wind.jpg",
    totalCopies: 12,
    availableCopies: 8,
    genre: "Fantasy",
  },
  {
    title: "Mistborn: The Final Empire",
    author: "Brandon Sanderson",
    isbn: "978-0765311788",
    description: "A desperate thief and a powerful young woman challenge a tyrannical ruler in a civilization built on ash and steel.",
    coverImage: "https://images.example.com/mistborn.jpg",
    totalCopies: 11,
    availableCopies: 6,
    genre: "Fantasy",
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "978-0547928227",
    description: "Bilbo Baggins embarks on a perilous adventure with dwarves, goblins, and a dragon in Middle-earth.",
    coverImage: "https://images.example.com/hobbit.jpg",
    totalCopies: 14,
    availableCopies: 9,
    genre: "Fantasy",
  },
  {
    title: "A Wizard of Earthsea",
    author: "Ursula K. Le Guin",
    isbn: "978-0441478127",
    description: "A young prince learns the balance of power and self through a journey of magical discovery and inner reckoning.",
    coverImage: "https://images.example.com/earthsea.jpg",
    totalCopies: 8,
    availableCopies: 5,
    genre: "Fantasy",
  },
  {
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    isbn: "978-0307269751",
    description: "A disgraced journalist and a brilliant hacker investigate a decades-old disappearance and a web of secrets.",
    coverImage: "https://images.example.com/dragon-tattoo.jpg",
    totalCopies: 10,
    availableCopies: 4,
    genre: "Mystery",
  },
  {
    title: "And Then There Were None",
    author: "Agatha Christie",
    isbn: "978-0062073488",
    description: "Ten strangers are trapped on an island, where a mysterious accusation game turns deadly.",
    coverImage: "https://images.example.com/then-there-were-none.jpg",
    totalCopies: 9,
    availableCopies: 3,
    genre: "Mystery",
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    isbn: "978-1250301703",
    description: "A psychotherapist becomes obsessed with a famous patient who refuses to speak after a shocking crime.",
    coverImage: "https://images.example.com/silent-patient.jpg",
    totalCopies: 6,
    availableCopies: 2,
    genre: "Mystery",
  },
  {
    title: "The Thursday Murder Club",
    author: "Richard Osman",
    isbn: "978-0241988266",
    description: "A clever group of retirees investigates a cold case while balancing tea, gossip, and sharp wit.",
    coverImage: "https://images.example.com/thursday-murder-club.jpg",
    totalCopies: 7,
    availableCopies: 5,
    genre: "Mystery",
  },
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    isbn: "978-0375842207",
    description: "A young girl in Nazi Germany discovers comfort and defiance through stolen books and a compassionate foster father.",
    coverImage: "https://images.example.com/book-thief.jpg",
    totalCopies: 13,
    availableCopies: 8,
    genre: "Historical Fiction",
  },
  {
    title: "All the Light We Cannot See",
    author: "Anthony Doerr",
    isbn: "978-1476746586",
    description: "Two lives intersect in occupied France as a blind French girl and a German boy struggle through war.",
    coverImage: "https://images.example.com/light-we-cannot-see.jpg",
    totalCopies: 10,
    availableCopies: 7,
    genre: "Historical Fiction",
  },
  {
    title: "The Night Circus",
    author: "Erin Morgenstern",
    isbn: "978-0385534639",
    description: "A magical circus appears overnight and draws star-crossed magicians into a duel hidden behind enchantment.",
    coverImage: "https://images.example.com/night-circus.jpg",
    totalCopies: 9,
    availableCopies: 6,
    genre: "Historical Fiction",
  },
  {
    title: "The Alice Network",
    author: "Kate Quinn",
    isbn: "978-0062654197",
    description: "An Allied spy and a modern-day American unravel a secret network of wartime resistance and personal loss.",
    coverImage: "https://images.example.com/alice-network.jpg",
    totalCopies: 8,
    availableCopies: 4,
    genre: "Historical Fiction",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-1503290563",
    description: "A sharp and witty novel about family expectations, social class, and the misjudgments that lead to love.",
    coverImage: "https://images.example.com/pride-prejudice.jpg",
    totalCopies: 12,
    availableCopies: 9,
    genre: "Romance",
  },
  {
    title: "The Rosie Project",
    author: "Graeme Simsion",
    isbn: "978-1476729077",
    description: "A socially awkward genetics professor embarks on a highly structured quest to find the perfect partner.",
    coverImage: "https://images.example.com/rosie-project.jpg",
    totalCopies: 8,
    availableCopies: 5,
    genre: "Romance",
  },
  {
    title: "Me Before You",
    author: "Jojo Moyes",
    isbn: "978-0143124542",
    description: "A young caretaker forms an unexpected bond with a man who has given up on life and learns to imagine a different future.",
    coverImage: "https://images.example.com/me-before-you.jpg",
    totalCopies: 10,
    availableCopies: 4,
    genre: "Romance",
  },
  {
    title: "The Flatshare",
    author: "Beth O'Leary",
    isbn: "978-0008207021",
    description: "Two strangers share a flat but live in different time blocks, uncovering a tender and deeply human connection.",
    coverImage: "https://images.example.com/flatshare.jpg",
    totalCopies: 9,
    availableCopies: 6,
    genre: "Romance",
  },
];

async function seedDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined. Add it to your .env file.");
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  await Promise.all([Genre.deleteMany({}), Book.deleteMany({})]);

  const insertedGenres = await Genre.insertMany(genreSeeds);

  const genreMap = new Map(
    insertedGenres.map((genre) => [genre.name, genre._id])
  );

  const booksToInsert = bookSeeds.map((book) => ({
    ...book,
    genre: genreMap.get(book.genre),
  }));

  await Book.insertMany(booksToInsert);

  console.log(`Seeded ${insertedGenres.length} genres and ${booksToInsert.length} books`);

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

seedDatabase().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exit(1);
});
