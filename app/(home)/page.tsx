import type { ComponentProps } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { highlight } from 'fumadocs-core/highlight';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { Callout } from 'fumadocs-ui/components/callout';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { ArrowRight, Blocks, BookOpen, Box, Cpu, Puzzle, Sparkles, Swords, Users } from 'lucide-react';
import { createCssVariablesTheme } from 'shiki';
import { Button } from '@/components/catalyst/button';
import { gitConfig } from '@/lib/shared';

// Same CSS-variables theme as the docs (lib/source.ts), so snippets follow the active site theme's code colours.
const codeTheme = createCssVariablesTheme({ name: 'css-variables', variablePrefix: '--shiki-', fontStyle: false });

const pluginSnippet = `import com.hypixel.hytale.server.core.plugin.JavaPlugin;
import com.hypixel.hytale.server.core.plugin.JavaPluginInit;
import com.hypixel.hytale.server.core.event.events.player.PlayerConnectEvent;

public class MyPlugin extends JavaPlugin {
    public MyPlugin(JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        getEventRegistry().register(PlayerConnectEvent.class, event -> {
            getLogger().info("Welcome, " + event.getPlayerRef().getUsername() + "!");
        });
    }
}`;

const assetSnippet = `{
  "Parent": "Template_Weapon_Sword",
  "Model": "Items/Weapons/Sword/Custom.blockymodel",
  "Quality": "Rare",
  "MaxDurability": 150,
  "InteractionVars": {
    "Swing_Left_Damage": {
      "DamageCalculator": { "BaseDamage": { "Physical": 18 } }
    }
  }
}`;

async function Snippet({ code, lang, title }: { code: string; lang: string; title: string }) {
  return highlight(code, {
    lang,
    theme: codeTheme,
    components: {
      pre: (props: ComponentProps<'pre'>) => (
        <CodeBlock title={title} className="my-0 h-full">
          <Pre {...props} />
        </CodeBlock>
      ),
    },
  });
}

function GithubIcon(props: ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3" />
    </svg>
  );
}

const quickLinks = [
  { href: '/plugin-development/core-concepts/event-system/', title: 'Event system', description: 'React to game state', icon: <Sparkles /> },
  { href: '/asset-development/items/overview/', title: 'Items & weapons', description: 'Swords, tools, armor, recipes', icon: <Swords /> },
  { href: '/asset-development/npcs/overview/', title: 'NPCs', description: 'Models, behaviors, spawning', icon: <Users /> },
  { href: '/plugin-development/core-concepts/ecs-overview/', title: 'ECS', description: 'The entity-component-system underneath it all', icon: <Cpu /> },
  { href: '/tutorials/builtin-plugins/', title: 'Built-in plugins', description: '31 official plugins you can study', icon: <Puzzle /> },
  { href: '/appendix/glossary/', title: 'Glossary', description: 'Terms used across the docs', icon: <BookOpen /> },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-(--fd-layout-width,1400px) flex-1 flex-col gap-20 px-6 py-16 md:py-24">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 text-center">
        <Image src="/logo.svg" alt="" width={64} height={64} priority unoptimized />
        <p className="rounded-full border border-fd-border bg-fd-secondary/60 px-3 py-1 text-xs font-medium text-fd-muted-foreground">
          By modders, for modders.
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">Hytale Modding Docs</h1>
        <p className="max-w-2xl text-lg text-balance text-fd-muted-foreground">
          Community-driven documentation for Hytale server modding: plugins, assets, and the systems underneath.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button color="primary" href="/getting-started/setup/">
            Get started
            <ArrowRight data-slot="icon" />
          </Button>
          <Button outline href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}>
            <GithubIcon data-slot="icon" />
            GitHub
          </Button>
        </div>
      </section>

      {/* Two tracks */}
      <section className="mx-auto w-full max-w-4xl">
        <Cards>
          <Card
            icon={<Box />}
            title="Asset Development"
            description="Items, blocks, NPCs, and effects through JSON. No Java required."
            href="/asset-development/overview/"
          />
          <Card
            icon={<Blocks />}
            title="Plugin Development"
            description="Java plugins with events, commands, and full API access."
            href="/getting-started/setup/"
          />
        </Cards>
      </section>

      {/* Quick taste */}
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight">A quick taste</h2>
          <p className="mt-2 text-fd-muted-foreground">A Java plugin and a JSON asset, side by side.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
          <Snippet code={pluginSnippet} lang="java" title="MyPlugin.java" />
          <Snippet code={assetSnippet} lang="json" title="Weapon_Sword_Custom.json" />
        </div>
      </section>

      {/* Where next */}
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Where to go next</h2>
          <p className="mt-2 text-fd-muted-foreground">
            New here?{' '}
            <Link className="font-medium text-fd-primary hover:underline" href="/getting-started/setup/">
              Set up your environment
            </Link>{' '}
            →{' '}
            <Link className="font-medium text-fd-primary hover:underline" href="/getting-started/extracting-the-server/">
              extract the server
            </Link>{' '}
            →{' '}
            <Link className="font-medium text-fd-primary hover:underline" href="/getting-started/first-plugin/">
              build your first plugin
            </Link>
            .
          </p>
        </div>
        <Cards className="sm:grid-cols-3">
          {quickLinks.map((l) => (
            <Card key={l.href} {...l} />
          ))}
        </Cards>
        <Callout type="info">
          Unofficial community resource built from decompiled source analysis. Not affiliated with Hypixel Studios. If you spot
          something wrong,{' '}
          <a className="font-medium underline" href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}>
            open an issue or PR
          </a>
          .
        </Callout>
      </section>
    </main>
  );
}
