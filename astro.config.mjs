// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import cloudflare from '@astrojs/cloudflare';
// Note: remark-mermaidjs requires Playwright which is incompatible with Cloudflare Workers
// Mermaid diagrams will use client-side rendering instead

// https://astro.build/config
export default defineConfig({
	// Custom domain
	site: 'https://doctale.dev',

	// Server output for Cloudflare Workers
	output: 'server',

	// Cloudflare Workers adapter
	adapter: cloudflare({
		imageService: 'passthrough',
		platformProxy: {
			enabled: true,
		},
	}),

	// Build configuration
	build: {
		assets: '_astro',
	},

	// Vite configuration for Cloudflare compatibility
	vite: {
		build: {
			target: 'esnext',
			cssTarget: 'chrome100',
		},
		ssr: {
			external: ['node:async_hooks'],
		},
	},

	// Limit Shiki languages to reduce bundle size for Cloudflare Workers (3MB limit)
	markdown: {
		shikiConfig: {
			// @ts-ignore - string array works at runtime for built-in languages
			langs: ['java', 'json', 'groovy', 'bash', 'xml'],
		},
	},

	integrations: [
		starlight({
			title: 'Hytale Server Modding',
			description: 'AI-generated documentation for Hytale server plugin development, curated from decompiled source code analysis. Unofficial community resource.',
			credits: true,
			logo: {
				src: './public/logo.svg',
				alt: 'Hytale Server Modding',
			},
			// Disabled to reduce bundle size for Cloudflare Workers
			// plugins: [starlightImageZoom(), starlightLinksValidator()],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/itsriprod/doctale' },
			],
			favicon: '/favicon.svg',
			head: [
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.googleapis.com',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.gstatic.com',
						crossorigin: true,
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'theme-color',
						content: '#0a0f1a',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:type',
						content: 'website',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:site_name',
						content: 'Hytale Server Modding Docs',
					},
				},
			],
			customCss: [
				'./src/styles/custom.css',
			],
			// Disable pagefind for SSR (not compatible with Workers)
			pagefind: false,
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Setup', slug: 'getting-started/setup' },
						{ label: 'Your First Plugin', slug: 'getting-started/first-plugin' },
						{ label: 'Plugin Lifecycle', slug: 'getting-started/plugin-lifecycle' },
						{ label: 'Plugin Manifest', slug: 'getting-started/plugin-manifest' },
					],
				},
				{
					label: 'Core Concepts',
					items: [
						{ label: 'Event System', slug: 'core-concepts/event-system' },
						{ label: 'ECS Overview', slug: 'core-concepts/ecs-overview' },
						{ label: 'Commands', slug: 'core-concepts/commands' },
						{ label: 'Registries', slug: 'core-concepts/registries' },
					],
				},
				{
					label: 'API Reference',
					items: [
						{
							label: 'World',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'api-reference/world/overview' },
								{ label: 'Connected Blocks', slug: 'api-reference/world/connected-blocks' },
								{ label: 'Lighting', slug: 'api-reference/world/lighting' },
								{ label: 'Dynamic Lighting', slug: 'api-reference/world/dynamic-lighting' },
							],
						},
						{
							label: 'Entities',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'api-reference/entities/overview' },
								{ label: 'Effects', slug: 'api-reference/entities/effects' },
								{ label: 'Groups', slug: 'api-reference/entities/groups' },
								{ label: 'Inventory', slug: 'api-reference/entities/inventory' },
								{ label: 'Knockback', slug: 'api-reference/entities/knockback' },
								{ label: 'Permissions', slug: 'api-reference/entities/permissions' },
							],
						},
						{
							label: 'Blocks',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'api-reference/blocks/overview' },
							],
						},
						{
							label: 'Assets',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'api-reference/assets/overview' },
								{
									label: 'Items',
									collapsed: true,
									items: [
										{ label: 'Overview', slug: 'api-reference/assets/items/overview' },
										{ label: 'Weapons', slug: 'api-reference/assets/items/weapons' },
										{ label: 'Tools', slug: 'api-reference/assets/items/tools' },
										{ label: 'Consumables', slug: 'api-reference/assets/items/consumables' },
										{ label: 'Armor', slug: 'api-reference/assets/items/armor' },
										{ label: 'Combat System', slug: 'api-reference/assets/items/combat' },
										{ label: 'Recipes', slug: 'api-reference/assets/items/recipes' },
										{ label: 'Durability & Quality', slug: 'api-reference/assets/items/durability' },
									],
								},
								{
									label: 'Blocks',
									collapsed: true,
									items: [
										{ label: 'Block Types', slug: 'api-reference/assets/blocks/block-types' },
										{ label: 'Textures', slug: 'api-reference/assets/blocks/textures' },
										{ label: 'Decorative Sets', slug: 'api-reference/assets/blocks/decorative-sets' },
										{ label: 'Animations', slug: 'api-reference/assets/blocks/animations' },
									],
								},
								{
									label: 'NPCs',
									collapsed: true,
									items: [
										{ label: 'Asset Overview', slug: 'api-reference/assets/npcs/overview' },
										{ label: 'Model Definitions', slug: 'api-reference/assets/npcs/models' },
										{ label: 'Groups', slug: 'api-reference/assets/npcs/groups' },
										{ label: 'Behaviors', slug: 'api-reference/assets/npcs/behaviors' },
										{ label: 'Attachments', slug: 'api-reference/assets/npcs/attachments' },
									],
								},
								{
									label: 'Audio',
									collapsed: true,
									items: [
										{ label: 'Overview', slug: 'api-reference/assets/audio/overview' },
										{ label: 'Sound Events', slug: 'api-reference/assets/audio/sound-events' },
										{ label: 'Sound Sets', slug: 'api-reference/assets/audio/sound-sets' },
										{ label: 'Effects', slug: 'api-reference/assets/audio/effects' },
									],
								},
								{
									label: 'VFX',
									collapsed: true,
									items: [
										{ label: 'Particles', slug: 'api-reference/assets/vfx/particles' },
										{ label: 'Trails', slug: 'api-reference/assets/vfx/trails' },
										{ label: 'Model Effects', slug: 'api-reference/assets/vfx/model-effects' },
									],
								},
								{
									label: 'World',
									collapsed: true,
									items: [
										{ label: 'Environments', slug: 'api-reference/assets/world/environments' },
										{ label: 'Weather', slug: 'api-reference/assets/world/weather' },
										{ label: 'Instances', slug: 'api-reference/assets/world/instances' },
										{ label: 'Prefabs', slug: 'api-reference/assets/world/prefabs' },
									],
								},
							],
						},
						{
							label: 'ECS',
							collapsed: true,
							items: [
								{ label: 'Component Catalog', slug: 'api-reference/ecs/component-catalog' },
							],
						},
						{
							label: 'Events',
							collapsed: true,
							items: [
								{ label: 'Event Catalog', slug: 'api-reference/events/event-catalog' },
							],
						},
						{
							label: 'Networking',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'api-reference/networking/overview' },
								{ label: 'Packet Types', slug: 'api-reference/networking/packet-types' },
								{ label: 'Packet Handlers', slug: 'api-reference/networking/packet-handlers' },
								{ label: 'Client Sync', slug: 'api-reference/networking/client-sync' },
							],
						},
						{
							label: 'Physics',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'api-reference/physics/overview' },
								{ label: 'Collision', slug: 'api-reference/physics/collision' },
								{ label: 'Hitboxes', slug: 'api-reference/physics/hitboxes' },
								{ label: 'Movement', slug: 'api-reference/physics/movement' },
							],
						},
						{
							label: 'Interaction',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'api-reference/interaction/overview' },
								{ label: 'Block Tracking', slug: 'api-reference/interaction/block-tracking' },
								{ label: 'Custom Interactions', slug: 'api-reference/interaction/custom-interactions' },
								{ label: 'Java Operations', slug: 'api-reference/interaction/java-operations' },
							],
						},
						{
							label: 'Inventory',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'api-reference/inventory/overview' },
							],
						},
						{
							label: 'NPC',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'api-reference/npc/overview' },
							],
						},
						{
							label: 'Permissions',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'api-reference/permissions/overview' },
							],
						},
						{
							label: 'Serialization',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'api-reference/serialization/overview' },
							],
						},
						{
							label: 'Math',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'api-reference/math/overview' },
							],
						},
						{
							label: 'Server',
							collapsed: true,
							items: [
								{ label: 'Configuration', slug: 'api-reference/server/configuration' },
							],
						},
						{
							label: 'World Generation',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'api-reference/worldgen/overview' },
							],
						},
					],
				},
				{
					label: 'Tutorials',
					items: [
						{ label: 'Built-in Plugins', slug: 'tutorials/builtin-plugins' },
						{
							label: 'Blockbench',
							collapsed: true,
							items: [
								{ label: 'Setup', slug: 'tutorials/blockbench/setup' },
							],
						},
						{
							label: 'Examples',
							collapsed: true,
							items: [
								{ label: 'Custom Weapon', slug: 'tutorials/examples/custom-weapon' },
							],
						},
					],
				},
				{
					label: 'Appendix',
					items: [
						{ label: 'Glossary', slug: 'appendix/glossary' },
					],
				},
			],
		}),
	],
});
