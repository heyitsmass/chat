import {
	Archive,
	Atom,
	Baby,
	Book,
	BookOpen,
	Bot,
	Brain,
	Brush,
	Bug,
	Calendar,
	Calendar1,
	Candy,
	CheckCircle,
	ChefHat,
	Clock,
	CloudRain,
	Coffee,
	Compass,
	Cpu,
	Crown,
	Dice6,
	Dna,
	DollarSign,
	Eye,
	Film,
	Flower,
	Frown,
	Gamepad,
	Ghost,
	Gift,
	Glasses,
	Globe,
	GraduationCap,
	Heart,
	HelpCircle,
	History,
	Home,
	Hourglass,
	Languages,
	Laugh,
	Leaf,
	Lightbulb,
	Lock,
	LucideProps,
	MapPin,
	Medal,
	Megaphone,
	MessageCircle,
	MessageSquare,
	Microscope,
	Mountain,
	Music,
	Navigation,
	Palette,
	Phone,
	Puzzle,
	Rocket,
	Scale,
	Shield,
	Smartphone,
	Smile,
	Sparkles,
	Star,
	Sun,
	SunMoon,
	Target,
	Timer,
	Trash2,
	TreePine,
	TrendingUp,
	Trophy,
	Truck,
	Tv,
	Users,
	Utensils,
	Wand2,
} from "lucide-react";
import React, { PropsWithoutRef, RefAttributes } from "react";
import { Merge } from "type-fest";

export const conversationTopics: Record<string, Suggestion[]> = {
	"Science & Technology": [
		{ id: 1, topic: "How gravity affects daily life", icon: Atom },
		{ id: 2, topic: "Genetic modification of mosquitoes", icon: Dna },
		{ id: 3, topic: "Quantum computing and encryption", icon: Cpu },
		{ id: 4, topic: "Why we haven't found alien life", icon: Rocket },
		{ id: 5, topic: "Brain-computer interface implications", icon: Brain },
		{ id: 6, topic: "Knowing your exact death date", icon: Calendar },
		{ id: 7, topic: "Recent scientific breakthroughs", icon: Microscope },
		{ id: 8, topic: "Mars terraforming versus Earth repair", icon: Leaf },
		{
			id: 9,
			topic: "Artificial photosynthesis potential",
			icon: Lightbulb,
		},
		{ id: 10, topic: "Ethics of human embryo editing", icon: Shield },
	],

	"Philosophy & Ethics": [
		{ id: 11, topic: "Free will versus determinism", icon: Scale },
		{ id: 12, topic: "Universal basic income effects", icon: DollarSign },
		{ id: 13, topic: "When lying is morally acceptable", icon: Heart },
		{ id: 14, topic: "Living in a mind-reading society", icon: Eye },
		{
			id: 15,
			topic: "Species protection versus human needs",
			icon: TreePine,
		},
		{ id: 16, topic: "Boredom's role in creativity", icon: Sparkles },
		{
			id: 17,
			topic: "Perfect justice with transparent thoughts",
			icon: Scale,
		},
		{
			id: 18,
			topic: "Difference between surviving and thriving",
			icon: Star,
		},
		{ id: 19, topic: "Legal organ market ethics", icon: Heart },
		{ id: 20, topic: "Moral obligation to be happy", icon: Smile },
	],

	"Culture & Society": [
		{ id: 21, topic: "Why certain songs give us chills", icon: Music },
		{ id: 22, topic: "Life without social media", icon: Phone },
		{ id: 23, topic: "Cultural definitions of success", icon: Trophy },
		{ id: 24, topic: "Preserving dying languages", icon: Languages },
		{ id: 25, topic: "Unusual family traditions", icon: Gift },
		{ id: 26, topic: "Internet's impact on friendships", icon: Users },
		{
			id: 27,
			topic: "Illogical social rules we follow",
			icon: MessageCircle,
		},
		{ id: 28, topic: "Art's need for deeper meaning", icon: Palette },
		{ id: 29, topic: "How future generations will judge us", icon: Clock },
		{
			id: 30,
			topic: "Most overrated modern lifestyle aspects",
			icon: Frown,
		},
	],

	"Psychology & Human Behavior": [
		{ id: 31, topic: "Why some fears thrill us", icon: Ghost },
		{ id: 32, topic: "Appeal of conspiracy theories", icon: Eye },
		{ id: 33, topic: "How living spaces reflect personality", icon: Home },
		{ id: 34, topic: "Why embarrassing memories stick", icon: Brain },
		{ id: 35, topic: "What makes someone charismatic", icon: Star },
		{ id: 36, topic: "Childhood fears shaping adult choices", icon: Baby },
		{ id: 37, topic: "Procrastinating on desired tasks", icon: Timer },
		{ id: 38, topic: "Being alone versus being lonely", icon: Heart },
		{
			id: 39,
			topic: "Colors affecting mood subconsciously",
			icon: Palette,
		},
		{ id: 40, topic: "Nostalgia for unexperienced times", icon: History },
	],

	"Food & Lifestyle": [
		{
			id: 41,
			topic: "Strange food combinations that work",
			icon: Utensils,
		},
		{ id: 42, topic: "Mandatory calorie counts on menus", icon: BookOpen },
		{
			id: 43,
			topic: "Food delivery's impact on eating habits",
			icon: Truck,
		},
		{ id: 44, topic: "Weirdest food trends worth trying", icon: Candy },
		{
			id: 45,
			topic: "Eating insects for environmental reasons",
			icon: Bug,
		},
		{
			id: 46,
			topic: "How cooking methods affect food personality",
			icon: ChefHat,
		},
		{ id: 47, topic: "Overlooked simple pleasures", icon: Sun },
		{
			id: 48,
			topic: "Food preparation rituals and enjoyment",
			icon: Coffee,
		},
		{
			id: 49,
			topic: "Essential cooking skills for independence",
			icon: GraduationCap,
		},
		{
			id: 50,
			topic: "Taste preferences reflecting cultural background",
			icon: Globe,
		},
	],

	"Travel & Geography": [
		{
			id: 51,
			topic: "Most beautiful unvisited dream destinations",
			icon: Mountain,
		},
		{ id: 52, topic: "Climate's influence on personality", icon: SunMoon },
		{
			id: 53,
			topic: "Limiting tourism for environmental protection",
			icon: Leaf,
		},
		{
			id: 54,
			topic: "Cultural misunderstandings while traveling",
			icon: Languages,
		},
		{
			id: 55,
			topic: "GPS impact on navigation and exploration",
			icon: Navigation,
		},
		{ id: 56, topic: "Places misrepresented in movies", icon: Film },
		{
			id: 57,
			topic: "Virtual reality changing travel experiences",
			icon: Glasses,
		},
		{ id: 58, topic: "Most remote places worth visiting", icon: Compass },
		{
			id: 59,
			topic: "Language affecting directional thinking",
			icon: MessageCircle,
		},
		{
			id: 60,
			topic: "Essential local knowledge for visitors",
			icon: MapPin,
		},
	],

	"History & Time": [
		{
			id: 61,
			topic: "Historical events with biggest impact if prevented",
			icon: Clock,
		},
		{
			id: 62,
			topic: "Past generations' reactions to modern routines",
			icon: History,
		},
		{
			id: 63,
			topic: "Historical figures ahead of their time",
			icon: Crown,
		},
		{ id: 64, topic: "Evolution of childhood concepts", icon: Baby },
		{ id: 65, topic: "Fascinating historical coincidences", icon: Dice6 },
		{
			id: 66,
			topic: "Cultural differences in time perception",
			icon: Timer,
		},
		{
			id: 67,
			topic: "Historical mysteries worth solving",
			icon: HelpCircle,
		},
		{
			id: 68,
			topic: "Changing methods of life documentation",
			icon: Archive,
		},
		{ id: 69, topic: "Past practices worth reviving", icon: Hourglass },
		{
			id: 70,
			topic: "How historians will remember the 2020s",
			icon: Calendar1,
		},
	],

	"Entertainment & Creativity": [
		{ id: 71, topic: "Media that changed perspectives", icon: Book },
		{
			id: 72,
			topic: "Streaming's impact on content consumption",
			icon: Tv,
		},
		{
			id: 73,
			topic: "Horror movie appeal for easily scared people",
			icon: Ghost,
		},
		{ id: 74, topic: "AI creating commercial art", icon: Bot },
		{ id: 75, topic: "Underrated creative hobbies", icon: Brush },
		{ id: 76, topic: "Generational differences in humor", icon: Laugh },
		{
			id: 77,
			topic: "Most creative problem-solving examples",
			icon: Lightbulb,
		},
		{ id: 78, topic: "Social media redefining fame", icon: Star },
		{ id: 79, topic: "Impressive but learnable skills", icon: Wand2 },
		{
			id: 80,
			topic: "Video games versus traditional storytelling",
			icon: Gamepad,
		},
	],

	"Future & Speculation": [
		{ id: 81, topic: "Jobs becoming obsolete soon", icon: TrendingUp },
		{
			id: 82,
			topic: "Climate change affecting living locations",
			icon: CloudRain,
		},
		{ id: 83, topic: "Emerging social movements", icon: Megaphone },
		{ id: 84, topic: "AI transforming education", icon: Bot },
		{
			id: 85,
			topic: "Current practices future generations will condemn",
			icon: Trash2,
		},
		{
			id: 86,
			topic: "Space colonization affecting human evolution",
			icon: Rocket,
		},
		{ id: 87, topic: "Most optimistic future predictions", icon: Star },
		{ id: 88, topic: "Evolving privacy relationships", icon: Lock },
		{
			id: 89,
			topic: "Technology that will seem primitive soon",
			icon: Smartphone,
		},
		{
			id: 90,
			topic: "VR and AR changing social interactions",
			icon: Glasses,
		},
	],

	"Personal & Reflective": [
		{ id: 91, topic: "Skills worth instantly mastering", icon: Target },
		{ id: 92, topic: "Evolving definitions of success", icon: Medal },
		{ id: 93, topic: "Initially ignored good advice", icon: MessageSquare },
		{ id: 94, topic: "Signs of true understanding", icon: Lightbulb },
		{
			id: 95,
			topic: "Questions people should ask more often",
			icon: HelpCircle,
		},
		{
			id: 96,
			topic: "Balancing information consumption and mental health",
			icon: Shield,
		},
		{ id: 97, topic: "Childhood beliefs that proved wrong", icon: Puzzle },
		{ id: 98, topic: "Deciding what deserves worry", icon: Scale },
		{
			id: 99,
			topic: "Moments of personal growth recognition",
			icon: CheckCircle,
		},
		{
			id: 100,
			topic: "Things that should never change about the world",
			icon: Flower,
		},
	],
};
// Fisher-Yates shuffle algorithm
export function fisherYatesShuffle(array: Suggestion[]): Suggestion[] {
	// Create a copy to avoid mutating the original array
	const shuffled = [...array];

	for (let i = shuffled.length - 1; i > 0; i--) {
		// Generate random index from 0 to i
		const j = Math.floor(Math.random() * (i + 1));

		// Swap elements at positions i and j
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	return shuffled;
}

/**
 * Helper function to get all suggestions as a flat array
 * @returns An array of all conversation suggestions from all categories.
 */
export function getAllSuggestions() {
	return Object.values(conversationTopics).flat();
}

/**
 * Helper function to get shuffled suggestions from a specific category
 * @param category The category of conversation topics to get suggestions from.
 * @returns A shuffled array of suggestions from the specified category.
 * @throws Error if the category does not exist.
 */
export function getShuffledSuggestionsByTopic(
	category: keyof typeof conversationTopics
) {
	const topics = conversationTopics[category];
	if (!topics) {
		throw new Error(`Category "${category}" not found`);
	}
	return fisherYatesShuffle(topics);
}

/**
 * Helper function to get shuffled suggestions from all categories
 * @returns A shuffled array of all suggestions from all categories.
 */
export function getAllSuffledSuggestions() {
	return fisherYatesShuffle(getAllSuggestions());
}

/**
 * Helper function to get a random suggestion from all categories
 * @returns A random suggestion from all conversation topics.
 */
export function getRandomSuggestion() {
	const allTopics = getAllSuggestions();
	const randomIndex = Math.floor(Math.random() * allTopics.length);
	return allTopics[randomIndex];
}

/**
 * Helper function to get a specified number of random suggestions
 * @param count The number of random suggestions to return. {default: 5}
 * @returns An array of random suggestions, up to the specified count.
 */
export function getRandomSuggestions(count = 5) {
	const shuffledTopics = getAllSuffledSuggestions();
	return shuffledTopics.slice(0, Math.min(count, shuffledTopics.length));
}

export type Suggestion = {
	id: number;
	topic: string;
	icon: React.ComponentType<
		PropsWithoutRef<Merge<LucideProps, RefAttributes<SVGSVGElement>>>
	>;
};
