import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

const DISCORD_WEBHOOK_URL =
    "https://discord.com/api/webhooks/1463904308021035071/bYTsqWw6DftuYGd-cuhC7qFQtp-0srDQqiLMZmKi-BI-WMV6Jcjo87yyNWdZZK8G0Fw-";

const feedbackTypeColors = {
    general: 0x6366f1,
    bug: 0xef4444,
    feature: 0x22c55e,
    improvement: 0xf59e0b,
} as const;

const feedbackTypeEmojis = {
    general: "💬",
    bug: "🐛",
    feature: "✨",
    improvement: "💡",
} as const;

const feedbackTypeLabels = {
    general: "General Feedback",
    bug: "Bug Report",
    feature: "Feature Request",
    improvement: "Improvement Suggestion",
} as const;

export const feedbackRouter = createTRPCRouter({
    submit: publicProcedure
        .input(
            z.object({
                name: z.string().optional(),
                email: z.string().email("Invalid email address"),
                type: z.enum(["general", "bug", "feature", "improvement"]),
                message: z.string().min(10, "Message must be at least 10 characters"),
            }),
        )
        .mutation(async ({ input }) => {
            const { name, email, type, message } = input;

            const emoji = feedbackTypeEmojis[type];
            const color = feedbackTypeColors[type];
            const label = feedbackTypeLabels[type];

            const discordPayload = {
                embeds: [
                    {
                        title: `${emoji} New ${label}`,
                        color: color,
                        fields: [
                            {
                                name: "From",
                                value: name?.trim() || "Anonymous",
                                inline: true,
                            },
                            {
                                name: "Email",
                                value: email,
                                inline: true,
                            },
                            {
                                name: "Type",
                                value: label,
                                inline: true,
                            },
                            {
                                name: "Message",
                                value:
                                    message.length > 1024
                                        ? `${message.slice(0, 1021)}...`
                                        : message,
                                inline: false,
                            },
                        ],
                        footer: {
                            text: "100xPractice Feedback System",
                        },
                        timestamp: new Date().toISOString(),
                    },
                ],
            };

            try {
                const response = await fetch(DISCORD_WEBHOOK_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(discordPayload),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Discord webhook error:", errorText);
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to send feedback. Please try again later.",
                    });
                }

                return {
                    success: true,
                    message: "Thank you! Your feedback has been submitted successfully.",
                };
            } catch (error) {
                console.error("Error sending feedback to Discord:", error);

                if (error instanceof TRPCError) {
                    throw error;
                }

                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to send feedback. Please try again later.",
                });
            }
        }),
});
