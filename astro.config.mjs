// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	// Custom domain
	site: 'https://doctale.dev',

	// Static output for Cloudflare Pages (optimal for documentation)
	output: 'static',

	// Build configuration
	build: {
		// Cloudflare Pages serves from root
		assets: '_astro',
	},

	// Vite configuration for Cloudflare compatibility
	vite: {
		build: {
			// Ensure compatibility with Cloudflare's environment
			target: 'esnext',
			cssTarget: 'chrome100',
		},
	},

	integrations: [
		starlight({
			title: 'Hytale Server Modding',
			description: 'Comprehensive documentation for Hytale server plugin development',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/hypixel-studios/hytale' },
			],
			favicon: '/favicon.svg',
			head: [
				{
					tag: 'meta',
					attrs: {
						name: 'theme-color',
						content: '#1a1a2e',
					},
				},
				// Open Graph meta tags for social sharing
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
			// Enable built-in search
			pagefind: true,
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
