import { ensureDir } from "https://deno.land/std/fs/ensure_dir.ts";
import yargs from "https://deno.land/x/yargs@v17.6.0-deno/deno.ts";
import { Arguments } from "https://deno.land/x/yargs@v17.6.0-deno/deno-types.ts";
import { red, yellow, green, bold } from "https://deno.land/std/fmt/colors.ts";
import { basename, dirname } from "https://deno.land/std/path/mod.ts";

const generateBoilerPlateCode = (name: string) => {
  console.info(`Generating boilerplate code for ${name} component`);
  const compoContent: string = `import React from 'react';
  import Styled${name} from './${name}.style.tsx';
  
  type BaseProps = React.ComponentPropsWithoutRef<'div'>;
  export interface ${name}Props extends BaseProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  }
  
  const ${name} = React.forwardRef<HTMLDivElement,${name}Props>(( {children, style, ...rest}, ref) => {
      return (
          <Styled${name} style={style} {...rest}> 
          {children}
          </Styled${name}>
      );
  })
  export default ${name};
  `;

  const StyleContent: string = `import styled from 'styled-components';
  
  export const Styled${name} = styled.div${"`"} 
  //Change the base HTML as needed above
  //Style goes here
  ${"`"}
  `;

  const IndexContent: string = `import ${name} from './${name}';
  
  export {
      ${name}
  }
  `;

  const StoryContent: string = `import React from 'react';
  import { ComponentStory, ComponentMeta } from '@storybook/react';
  import { ${name} } from '.';
  
  export default {
    title: '${name}', 
    component: ${name},
    parameters: {
      controls: { expanded: true }, 
    },
    argTypes: {
      children: {
        control: { type: 'text' }, 
        description:
          'In this table, the children prop is only ever a string for control purposes. In-situ, the children prop can be any valid React Node.',
        table: {
          type: {
            summary: 'React.ReactNode', 
            detail: 'Children rendered inside button',
          },
        },
      },
      style: {
        control: { type: 'object' },
        description:
          'A CSSProperty object. Anything passed here will overwrite the out of the box style.',
        table: {
          type: {
            summary: 'object',
          },
        },
      },
    },
  } as ComponentMeta<typeof ${name}>;
  
  const Template: ComponentStory<typeof ${name}> = args => <${name} {...args} />; 
  
  export const Default = Template.bind({}); 
  Default.args = {
    children: 'Init',
    style: {},
  };
  `;

  const compoPath: string = "src/components/" + name + "/";

  const cwd = Deno.cwd();
  if (!basename(cwd).includes("component-library")) {
    console.error(
      red(
        `You are currently in ${cwd}. Please navigate to jslib/component-library folder before using this tool!`
      )
    );
    Deno.exit(1);
  }

  console.info(yellow(`Generating boilerplate for ${bold(name)}`));
  ensureDir(compoPath)
    .then(async () => {
      await Deno.writeTextFile(compoPath + `${name}.tsx`, compoContent);
      console.info(green(`${bold(compoPath + `${name}.tsx`)}`));

      await Deno.writeTextFile(compoPath + `${name}.style.tsx`, StyleContent);
      console.info(green(`${bold(compoPath + `${name}.style.tsx`)}`));

      await Deno.writeTextFile(compoPath + `index.ts`, IndexContent);
      console.info(green(`${bold(compoPath + `index.ts`)}`));

      await Deno.writeTextFile(compoPath + `${name}.stories.tsx`, StoryContent);
      console.info(green(`${bold(compoPath + `${name}.stories.tsx`)}`));

      console.info("Done!");
      Deno.exit(0);
    })
    .catch((err) => {
      console.info(red("error"));
      console.error(err);
      Deno.exit(1);
    });
};

interface Arguments {
  generate: string;
  list: string;
  open: string;
}

let inputArgs: Arguments = yargs(Deno.args)
  .usage("Usage: $0 <command> [arg]")
  .demandCommand(1, 1, "You can run generate or open")
  .help("h")
  .alias("h", "help")
  .command(
    "generate",
    "Generate boilerplate code for given component",
    (yargs) => {
      const length = yargs.argv._.length;
      if (length !== 2) {
        console.error(
          red(
            `You passed in ${
              length - 1
            } arguments after the generate keyword. You can only pass in one component name. For example, ${
              yargs.argv.$0
            } generate Button`
          )
        );
        Deno.exit(1);
      }

      const name = yargs.argv._[1];
      generateBoilerPlateCode(name);
    }
  )
  .example(
    "$0 generate Button",
    "Generates boilerplate code to create Button component"
  )
  .nargs("generate", 1)
  .command("open", "Opens latest Storybook in the browser", () => {
    Deno.run({
      cmd: [
        "open",
        "https://master--624cacae694b6d003ac979bf.chromatic.com/?path=/story/badge--default",
      ],
    });
    return Deno.exit(0);
  })
  .example("$0 open", "Opens latest Storybook in the browser").argv;
