import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../assets/js/urbanrupee-chatbot-knowledge.js");

const KB = [
  {
    k: [
      "what is urbanrupee",
      "tell me about urbanrupee",
      "about urbanrupee",
      "what does urbanrupee",
      "who is urbanrupee",
      "urban rupee",
      "explain urbanrupee",
    ],
    a: "Urbanrupee is a fintech and digital payments technology company that helps businesses manage and optimize their payment operations through advanced tools like orchestration, analytics, and automation.",
  },
  {
    k: [
      "payment gateway",
      "is urbanrupee a gateway",
      "urbanrupee a payment gateway",
      "urbanrupee gateway",
      "are you a gateway",
    ],
    a: "No, Urbanrupee is not a payment gateway. We provide a technology layer that integrates with multiple payment partners to help businesses streamline and manage their payment ecosystem efficiently.",
  },
  {
    k: [
      "what services",
      "services does urbanrupee",
      "what do you offer",
      "urbanrupee offer",
      "list of services",
      "what can you do",
      "capabilities",
    ],
    a: "Urbanrupee provides:\n\n• Unified Dashboard for centralized payment visibility\n• Payment Orchestration to route transactions intelligently across providers\n• Custom Checkout Solutions tailored to your business needs\n• Payout Portal for beneficiaries, bulk payouts, and disbursement controls\n• Close Route Wallet for policy-bound balances and in-route transfers\n• Transaction Tracking & Monitoring\n• AML Detection Tools for risk and fraud monitoring\n• Automatic Reconciliation to simplify financial operations",
  },
  {
    k: [
      "unified dashboard",
      "what is a unified dashboard",
      "single interface payments",
      "centralized payment visibility",
    ],
    a: "Our unified dashboard provides a single interface where businesses can track transactions, settlements, performance metrics, and reports across multiple payment partners in real time.",
  },
  {
    k: [
      "what is payment orchestration",
      "payment orchestration",
      "orchestration in urbanrupee",
      "orchestrate payments",
      "intelligently route transactions",
    ],
    a: "Payment orchestration allows businesses to connect with multiple payment providers and intelligently route transactions to improve success rates, reduce costs, and enhance customer experience.",
  },
  {
    k: ["custom checkout", "what is custom checkout", "branded checkout", "checkout tailored"],
    a: "Custom checkout enables businesses to design and control the payment experience for their customers, ensuring a seamless, branded, and optimized checkout flow.",
  },
  {
    k: [
      "payout portal",
      "what is payout portal",
      "urbanrupee payouts",
      "bulk payouts",
      "vendor payouts",
      "disbursement portal",
      "payout dashboard",
    ],
    a: "The Urbanrupee Payout Portal is a secure hub for outbound money: manage beneficiaries, run instant or scheduled bulk payouts to bank accounts or wallets, track statuses end-to-end, and use controls like roles, approvals, and exports for finance and compliance.",
  },
  {
    k: [
      "close route wallet",
      "what is close route wallet",
      "closed loop wallet",
      "urbanrupee wallet",
      "programme wallet",
      "ring fenced wallet",
    ],
    a: "Urbanrupee's Close Route Wallet is a controlled wallet product for programs that need balances, transfers, and spends to stay on approved paths only—paired with policies, ledgers, and APIs so you can run loyalty, marketplace, or B2B wallet flows with clear auditability.",
  },
  {
    k: [
      "how does the aml",
      "aml detector",
      "aml detection",
      "anti-money laundering",
      "suspicious patterns transactions",
    ],
    a: "Our AML (Anti-Money Laundering) detection system helps monitor transactions and identify suspicious patterns, enabling businesses to manage risk and comply with regulatory requirements.",
  },
  {
    k: [
      "automatic reconciliation",
      "how does automatic reconciliation",
      "reconciliation help businesses",
      "matches transactions with settlements",
    ],
    a: "Automatic reconciliation matches transactions with settlements, reducing manual effort, minimizing errors, and improving financial accuracy.",
  },
  {
    k: [
      "store cardholder",
      "cardholder data",
      "chd",
      "pci dss",
      "sensitive card data",
      "do you store card",
    ],
    a: "No, Urbanrupee does not store sensitive cardholder data. We follow strict data protection and encryption practices aligned with PCI DSS standards.",
  },
  {
    k: [
      "improve payment success",
      "success rates",
      "payment success rate",
      "optimal payment partner",
    ],
    a: "Through payment orchestration and smart routing, Urbanrupee ensures transactions are processed via the most optimal payment partner, improving overall success rates.",
  },
  {
    k: [
      "integrate urbanrupee",
      "integrate with my existing",
      "existing systems",
      "api-based integration",
    ],
    a: "Yes, we offer flexible API-based integrations that can be customized according to your business requirements.",
  },
  {
    k: [
      "who can use",
      "who can use urbanrupee",
      "startups sme",
      "enterprises payments",
      "who is it for",
    ],
    a: "Our platform is designed for startups, SMEs, and enterprises that want better control, visibility, and efficiency in managing digital payments.",
  },
  {
    k: [
      "how can i get started",
      "get started",
      "how to start",
      "onboarding setup",
      "begin with urbanrupee",
    ],
    a: "You can contact our team through the website, and we will guide you through onboarding, integration, and setup.",
  },
  {
    k: [
      "payment reliability",
      "improve payment reliability",
      "failover mechanisms",
      "reliable payment partners",
      "downtime payments",
    ],
    a: "Urbanrupee uses intelligent routing and failover mechanisms to ensure transactions are processed through the most reliable payment partners, reducing failures and downtime.",
  },
  {
    k: [
      "multiple payment providers",
      "several payment providers",
      "more than one provider",
      "single platform providers",
      "use multiple payment",
      "can i use multiple",
    ],
    a: "Yes, our payment orchestration layer allows you to integrate and manage multiple payment providers from a single platform.",
  },
  {
    k: [
      "real-time transaction",
      "real time tracking",
      "transaction tracking real",
      "status updates transactions",
    ],
    a: "Yes, our platform provides real-time tracking and status updates for all transactions through the unified dashboard.",
  },
  {
    k: [
      "what kind of reports",
      "what reports",
      "reports can i access",
      "dashboard reports",
    ],
    a: "You can access detailed reports on transactions, settlements, success rates, failures, and reconciliation—all from a single dashboard.",
  },
  {
    k: [
      "high-volume",
      "high volume",
      "high transaction volumes",
      "suitable for enterprise volume",
    ],
    a: "Yes, our platform is built to scale and can handle high transaction volumes efficiently for growing and enterprise-level businesses.",
  },
  {
    k: [
      "reduce operational workload",
      "operational complexity",
      "manual effort",
      "automating reconciliation",
    ],
    a: "By automating processes like reconciliation, transaction tracking, and reporting, Urbanrupee significantly reduces manual effort and operational complexity.",
  },
  {
    k: [
      "customize the payment flow",
      "customize payment",
      "tailor the payment experience",
      "payment flow for my business",
    ],
    a: "Yes, with our custom checkout and flexible APIs, you can tailor the payment experience to match your brand and user journey.",
  },
  {
    k: [
      "how secure",
      "platform secure",
      "security measures",
      "encryption access controls",
    ],
    a: "We implement robust security measures including encryption, access controls, and continuous monitoring to ensure safe and secure payment operations.",
  },
  {
    k: [
      "fraud prevention",
      "fraudulent transactions",
      "suspicious activities fraud",
    ],
    a: "Yes, our AML detection and monitoring tools help identify suspicious activities and reduce the risk of fraudulent transactions.",
  },
  {
    k: [
      "how does reconciliation work",
      "reconciliation on the platform",
      "settlement reports",
      "mismatches discrepancies",
    ],
    a: "Our system automatically matches transaction data with settlement reports, helping you quickly identify mismatches and resolve discrepancies.",
  },
  {
    k: [
      "what industries",
      "industries does urbanrupee",
      "e-commerce fintech education",
      "sectors you serve",
    ],
    a: "Urbanrupee supports a wide range of industries including e-commerce, fintech, education, healthcare, travel, and more.",
  },
  {
    k: [
      "how long does integration",
      "integration take",
      "integration timelines",
      "setup process quick",
    ],
    a: "Integration timelines depend on your requirements, but our APIs and support team ensure a quick and smooth setup process.",
  },
  {
    k: [
      "technical support during integration",
      "support during integration",
      "integration assistance",
    ],
    a: "Yes, our technical team assists you throughout the integration process and ensures everything is set up correctly.",
  },
  {
    k: [
      "insights into payment",
      "payment performance",
      "analytics tools",
      "success rates failures trends",
    ],
    a: "Yes, our analytics tools provide insights into success rates, failures, trends, and optimization opportunities.",
  },
  {
    k: [
      "makes urbanrupee different",
      "different from other payment",
      "why urbanrupee",
      "compared to other payment",
    ],
    a: "Urbanrupee focuses on providing a unified, intelligent, and flexible payment infrastructure that gives businesses more control, better visibility, and improved efficiency compared to traditional setups.",
  },
  {
    k: [
      "minimum transaction",
      "transaction requirement",
      "minimum volume",
    ],
    a: "No, our solutions are flexible and can be tailored to suit businesses of all sizes.",
  },
  {
    k: [
      "how do i contact support",
      "contact support",
      "reach support",
      "email or contact form",
      "customer support",
    ],
    a: "You can reach our support team via email or through the contact form on our website for any assistance.",
  },
  {
    k: [
      "white label solution",
      "white label payment",
      "urbanrupee white label",
      "own brand payment",
    ],
    a: "Urbanrupee’s white label solution allows businesses to offer payment services under their own brand name, without building the technology from scratch.",
  },
  {
    k: [
      "who can benefit from white label",
      "benefit from white label",
      "white label for fintech",
    ],
    a: "Fintech companies, aggregators, platforms, and enterprises looking to launch their own branded payment experience can benefit from our white label offerings.",
  },
  {
    k: [
      "features included white label",
      "white label features",
      "white label include",
    ],
    a: "Our white label solution can include:\n\n• Branded payment interfaces\n• Custom dashboards\n• Transaction tracking\n• Reporting and analytics\n• Integration with multiple payment partners",
  },
  {
    k: [
      "how customizable white label",
      "customizable white label",
      "white label branding",
    ],
    a: "The solution is highly customizable, allowing you to tailor the user interface, workflows, and features according to your business needs and branding guidelines.",
  },
  {
    k: ["what is hyper checkout", "hyper checkout", "hyper-checkout"],
    a: "Hyper Checkout is an advanced, optimized checkout experience designed to increase payment success rates and reduce drop-offs during the payment process.",
  },
  {
    k: [
      "hyper checkout improve conversions",
      "improve conversions checkout",
      "drop-offs",
      "reduce drop off",
    ],
    a: "It minimizes friction by offering a fast, seamless, and user-friendly payment experience with smart routing, saved preferences, and optimized flows.",
  },
  {
    k: ["customize hyper checkout", "hyper checkout customized", "hyper checkout customize"],
    a: "Yes, businesses can fully customize the checkout experience to align with their brand identity and customer journey.",
  },
  {
    k: [
      "hyper checkout payment methods",
      "hyper checkout multiple payment",
    ],
    a: "Yes, it supports multiple payment options through integrated payment partners, ensuring flexibility for customers.",
  },
  {
    k: [
      "reduce transaction failures",
      "orchestration help reduce",
      "how does orchestration help",
      "routing reduce failures",
      "transaction failures orchestration",
    ],
    a: "It dynamically routes transactions to the most reliable provider based on performance, availability, and success rates, reducing failures.",
  },
  {
    k: [
      "control routing rules",
      "routing rules",
      "define routing",
      "geography transaction value routing",
    ],
    a: "Yes, businesses can define and customize routing rules based on parameters like geography, transaction value, or payment method.",
  },
  {
    k: [
      "failover",
      "partner fails",
      "automatically routed to another provider",
    ],
    a: "Yes, if one payment partner fails, transactions can be automatically routed to another provider to ensure continuity.",
  },
  {
    k: [
      "products work together",
      "work seamlessly together",
      "hyper checkout orchestration white label together",
    ],
    a: "Urbanrupee’s products are designed to work seamlessly together—Hyper Checkout enhances the user experience, orchestration improves backend efficiency, and white label solutions provide branding and ownership.",
  },
  {
    k: [
      "choose only one product",
      "full suite",
      "individual products",
      "complete integrated solution",
    ],
    a: "You can choose individual products based on your business requirements or opt for a complete integrated solution.",
  },
  {
    k: ["solutions scalable", "are these solutions scalable", "scale with your business"],
    a: "Yes, all our products are built to scale with your business, supporting increasing transaction volumes and expansion needs.",
  },
];

const banner = `/* Urbanrupee chatbot knowledge — generated by scripts/build-chatbot-knowledge.mjs */\n`;

const body = `(function (global) {
  "use strict";
  if (!global) return;
  global.__URBANRUPEE_CHATBOT_KB__ = ${JSON.stringify(KB, null, 2)};
})(typeof window !== "undefined" ? window : null);
`;

fs.writeFileSync(outPath, banner + body, "utf8");
console.log("Wrote", outPath, KB.length, "entries");
