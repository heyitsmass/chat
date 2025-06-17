import {
	Brain,
	Cpu,
	Shield,
	Search,
	Globe,
	Eye,
	Volume2,
	Image,
	Table,
	Bot,
	Network,
	Gamepad2,
	Layers,
	MessageSquare,
	FileText,
	Zap,
	Target,
	BarChart3,
	Camera,
	Video,
	Mic,
} from "lucide-react";
import Sidebar from "./Sidebar";
import SidebarOpen from "./SidebarOpen";
import SidebarClose from "./SidebarClose";

// Icon selection priority system
const getModelIcon = (features: string[], modelName?: string) => {
	const normalizedName = modelName?.toLowerCase();
	const checkName = (...compare: string[]) => {
		for (const key of compare) {
			if (normalizedName?.includes(key)) return true;
		}
		return false;
	};

	const checkFeatures = (...compare: string[]) => {
		for (const key of compare) {
			if (features.includes(key)) return true;
		}
		return false;
	};

	// 1. Special cases based on model name/purpose
	if (checkName("guard", "safety")) return Shield;
	if (checkName("scout", "search")) return Search;

	// 2. Primary capability detection

	// Multimodal models (most complex)
	if (checkFeatures("MM", "A2A")) return Layers;

	// Vision-heavy models
	const visionFeatures = [
		"CV",
		"T2I",
		"I2T",
		"I2V",
		"T2V",
		"VQA",
		"OD",
		"IS",
	];

	const visionCount = features.filter((f) =>
		visionFeatures.includes(f)
	).length;

	if (visionCount >= 3) {
		return Eye;
	}

	// Audio-heavy models
	const audioFeatures = ["AUD", "T2S", "ASR", "T2A", "AC", "VAD"];
	const audioCount = features.filter((f) => audioFeatures.includes(f)).length;
	if (audioCount >= 2) {
		return Volume2;
	}

	// Tabular/Data models
	const tabularFeatures = ["TAB", "TBC", "TBR", "TSF"];
	if (features.some((f) => tabularFeatures.includes(f))) {
		return Table;
	}

	// Robotics/RL models
	if (features.includes("ROB") || features.includes("RL")) {
		return Bot;
	}

	// Graph ML
	if (features.includes("GML")) {
		return Network;
	}

	// 3. Language-focused models (most common)

	// Translation-heavy (multilingual)
	if (features.includes("TR")) {
		return Globe;
	}

	// Analysis/Research focused
	const analysisFeatures = ["SUM", "TXR", "FE", "DQA", "TQA"];
	const analysisCount = features.filter((f) =>
		analysisFeatures.includes(f)
	).length;
	if (analysisCount >= 2) {
		return Search;
	}

	// Classification focused
	const classificationFeatures = ["TC", "ZSC", "ZSIC", "ZSOD"];
	const classificationCount = features.filter((f) =>
		classificationFeatures.includes(f)
	).length;
	if (classificationCount >= 2) {
		return Target;
	}

	// Generation focused
	const generationFeatures = ["TG", "T2TG"];
	if (features.some((f) => generationFeatures.includes(f))) {
		return FileText;
	}

	// QA focused
	if (features.includes("QA")) {
		return MessageSquare;
	}

	// 4. Fallback based on feature count and complexity

	// Many features = complex model
	if (features.length >= 8) {
		return Brain;
	}

	// Medium complexity
	if (features.length >= 5) {
		return Cpu;
	}

	// Simple/fast models
	if (features.length <= 3) {
		return Zap;
	}

	// Default fallback
	return Brain;
};

// Helper function to get icon with reasoning
const getModelIconWithReason = (features: string[], modelName?: string) => {
	const icon = getModelIcon(features, modelName);
	let reason = "";

	// Determine reasoning
	if (modelName?.toLowerCase().includes("guard")) {
		reason = "Safety/Guard model";
	} else if (modelName?.toLowerCase().includes("scout")) {
		reason = "Research/Scout model";
	} else if (features.includes("MM") || features.includes("A2A")) {
		reason = "Multimodal capabilities";
	} else if (
		features.filter((f) => ["CV", "T2I", "I2T", "VQA"].includes(f))
			.length >= 2
	) {
		reason = "Vision-focused";
	} else if (features.includes("TR")) {
		reason = "Translation/Multilingual";
	} else if (features.length >= 8) {
		reason = "High complexity (8+ features)";
	} else if (features.includes("TG")) {
		reason = "Text generation focused";
	} else {
		reason = "General NLP model";
	}

	return { icon, reason };
};

export { getModelIcon, getModelIconWithReason };
export { Sidebar, SidebarClose, SidebarOpen };
