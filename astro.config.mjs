// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	// Custom domain
	site: 'https://doctale.dev',

	// Static output - pre-renders all pages at build time
	// Deployed to Cloudflare Pages (static assets only, no worker bundle)
	output: 'static',

	// Build configuration
	build: {
		assets: '_astro',
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
					label: 'Asset Development',
					items: [
						{ label: 'Overview', slug: 'asset-development/overview' },
						{
							label: 'Items',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'asset-development/items/overview' },
								{ label: 'Weapons', slug: 'asset-development/items/weapons' },
								{ label: 'Tools', slug: 'asset-development/items/tools' },
								{ label: 'Consumables', slug: 'asset-development/items/consumables' },
								{ label: 'Armor', slug: 'asset-development/items/armor' },
								{ label: 'Combat System', slug: 'asset-development/items/combat' },
								{ label: 'Recipes', slug: 'asset-development/items/recipes' },
								{ label: 'Durability & Quality', slug: 'asset-development/items/durability' },
							],
						},
						{
							label: 'Blocks',
							collapsed: true,
							items: [
								{ label: 'Block Types', slug: 'asset-development/blocks/block-types' },
								{ label: 'Textures', slug: 'asset-development/blocks/textures' },
								{ label: 'Decorative Sets', slug: 'asset-development/blocks/decorative-sets' },
								{ label: 'Animations', slug: 'asset-development/blocks/animations' },
							],
						},
						{
							label: 'NPCs',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'asset-development/npcs/overview' },
								{ label: 'Model Definitions', slug: 'asset-development/npcs/models' },
								{ label: 'Groups', slug: 'asset-development/npcs/groups' },
								{ label: 'Behaviors', slug: 'asset-development/npcs/behaviors' },
								{ label: 'Attachments', slug: 'asset-development/npcs/attachments' },
							],
						},
						{
							label: 'Audio',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'asset-development/audio/overview' },
								{ label: 'Sound Events', slug: 'asset-development/audio/sound-events' },
								{ label: 'Sound Sets', slug: 'asset-development/audio/sound-sets' },
								{ label: 'Effects', slug: 'asset-development/audio/effects' },
							],
						},
						{
							label: 'Visual Effects',
							collapsed: true,
							items: [
								{ label: 'Particles', slug: 'asset-development/vfx/particles' },
								{ label: 'Trails', slug: 'asset-development/vfx/trails' },
								{ label: 'Model Effects', slug: 'asset-development/vfx/model-effects' },
							],
						},
						{
							label: 'World',
							collapsed: true,
							items: [
								{ label: 'Environments', slug: 'asset-development/world/environments' },
								{ label: 'Weather', slug: 'asset-development/world/weather' },
								{ label: 'Instances', slug: 'asset-development/world/instances' },
								{ label: 'Prefabs', slug: 'asset-development/world/prefabs' },
							],
						},
					],
				},
				{
					label: 'Plugin Development',
					items: [
						{
							label: 'Core Concepts',
							collapsed: true,
							items: [
								{ label: 'Event System', slug: 'plugin-development/core-concepts/event-system' },
								{ label: 'ECS Overview', slug: 'plugin-development/core-concepts/ecs-overview' },
								{ label: 'Commands', slug: 'plugin-development/core-concepts/commands' },
								{ label: 'Registries', slug: 'plugin-development/core-concepts/registries' },
							],
						},
						{
							label: 'World',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'plugin-development/world/overview' },
								{ label: 'Connected Blocks', slug: 'plugin-development/world/connected-blocks' },
								{ label: 'Lighting', slug: 'plugin-development/world/lighting' },
								{ label: 'Dynamic Lighting', slug: 'plugin-development/world/dynamic-lighting' },
							],
						},
						{
							label: 'Entities',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'plugin-development/entities/overview' },
								{ label: 'Effects', slug: 'plugin-development/entities/effects' },
								{ label: 'Groups', slug: 'plugin-development/entities/groups' },
								{ label: 'Inventory', slug: 'plugin-development/entities/inventory' },
								{ label: 'Knockback', slug: 'plugin-development/entities/knockback' },
								{ label: 'Permissions', slug: 'plugin-development/entities/permissions' },
							],
						},
						{
							label: 'Blocks',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'plugin-development/blocks/overview' },
								{ label: 'Block Types', slug: 'plugin-development/blocks/block-types' },
								{ label: 'Block States', slug: 'plugin-development/blocks/block-states' },
								{ label: 'Block Events', slug: 'plugin-development/blocks/block-events' },
								{ label: 'Block Physics', slug: 'plugin-development/blocks/block-physics' },
								{ label: 'Block Ticking', slug: 'plugin-development/blocks/block-ticking' },
							],
						},
						{
							label: 'ECS',
							collapsed: true,
							items: [
								{ label: 'Component Catalog', slug: 'plugin-development/ecs/component-catalog' },
							],
						},
						{
							label: 'Events',
							collapsed: true,
							items: [
								{ label: 'Event Catalog', slug: 'plugin-development/events/event-catalog' },
							],
						},
						{
							label: 'Networking',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'plugin-development/networking/overview' },
								{ label: 'Packet Types', slug: 'plugin-development/networking/packet-types' },
								{ label: 'Packet Handlers', slug: 'plugin-development/networking/packet-handlers' },
								{ label: 'Client Sync', slug: 'plugin-development/networking/client-sync' },
							],
						},
						{
							label: 'Physics',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'plugin-development/physics/overview' },
								{ label: 'Collision', slug: 'plugin-development/physics/collision' },
								{ label: 'Hitboxes', slug: 'plugin-development/physics/hitboxes' },
								{ label: 'Movement', slug: 'plugin-development/physics/movement' },
							],
						},
						{
							label: 'Interactions',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'plugin-development/interactions/overview' },
								{ label: 'Block Tracking', slug: 'plugin-development/interactions/block-tracking' },
								{ label: 'Custom Interactions', slug: 'plugin-development/interactions/custom-interactions' },
								{ label: 'Java Operations', slug: 'plugin-development/interactions/java-operations' },
							],
						},
						{
							label: 'Inventory',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'plugin-development/inventory/overview' },
							],
						},
						{
							label: 'NPC',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'plugin-development/npc/overview' },
							],
						},
						{
							label: 'Permissions',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'plugin-development/permissions/overview' },
							],
						},
						{
							label: 'Serialization',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'plugin-development/serialization/overview' },
							],
						},
						{
							label: 'Math',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'plugin-development/math/overview' },
							],
						},
						{
							label: 'Server',
							collapsed: true,
							items: [
								{ label: 'Configuration', slug: 'plugin-development/server/configuration' },
								{ label: 'Update System', slug: 'plugin-development/server/update-system' },
							],
						},
						{
							label: 'World Generation',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'plugin-development/worldgen/overview' },
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
