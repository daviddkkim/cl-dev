import { ensureDir } from "https://deno.land/std/fs/ensure_dir.ts";

const { args: [name] } = Deno;


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

const compoPath: string = "./app/components/" + name + "/";
ensureDir(compoPath)
  .then(() => {
    Deno.writeTextFile(compoPath + `${name}.tsx`, compoContent);
    Deno.writeTextFile(compoPath + `${name}.style.tsx`, StyleContent);
    Deno.writeTextFile(compoPath + `index.ts`, IndexContent);
    Deno.writeTextFile(compoPath + `${name}.stories.tsx`, StoryContent);
    console.info("Done!");
});

