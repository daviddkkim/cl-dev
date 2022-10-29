import { ensureDir } from "https://deno.land/std/fs/ensure_dir.ts";
import {
    red,
    yellow,
    green,
    bold,
  } from "https://deno.land/std/fmt/colors.ts";

const { args: [name] } = Deno;
console.info(`${name} was passed in as the arg`)

const compoContent: string = `import React from 'react';
import Styled${name} from './${name}.style.tsx';

type BaseProps = React.ComponentPropsWithoutRef<'div'>;
export interface ${name}Props extends BaseProps {
children?: React.ReactNode;
style?: React.CSSProperties;
}


${name}.propTypes = {
    
};
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

export const Styled${name} = styled.div${'`'} 
//Change the base HTML as needed above
//Style goes here
${'`'}
`


const IndexContent: string =`import ${name} from './${name}';

export {
    ${name}
}
`

const StoryContent: string= `import React from 'react';
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
`

const compoPath: string = "~/component-library/src/components" + name + "/";

const cwd = Deno.cwd();
if(!cwd.includes('component-library')) {
    console.error(red(`You are currently in ${cwd}. please navigate to jslib/component-library folder before using this tool!`));
    Deno.exit(1);
}


console.info(yellow(`Generating boilerplate for ${bold(name)}`));
ensureDir(compoPath)
  .then( async() => {
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
.catch(err => {
    console.info(red('error'));
    console.error(err);
    Deno.exit(1);
  });

