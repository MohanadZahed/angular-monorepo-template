import type { Meta, StoryObj } from '@storybook/angular';
import { UiButtonComponent } from './ui-button';

const meta: Meta<UiButtonComponent> = {
  title: 'UI/Button',
  component: UiButtonComponent,
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    type: {
      control: 'inline-radio',
      options: ['button', 'submit', 'reset'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<ui-button [variant]="variant" [size]="size" [type]="type" [disabled]="disabled" [loading]="loading">Click me</ui-button>`,
  }),
};

export default meta;
type Story = StoryObj<UiButtonComponent>;

export const Primary: Story = {
  args: { variant: 'primary', size: 'md', disabled: false, loading: false },
};

export const Secondary: Story = {
  args: { variant: 'secondary', size: 'md', disabled: false, loading: false },
};

export const Danger: Story = {
  args: { variant: 'danger', size: 'md', disabled: false, loading: false },
};

export const Small: Story = {
  args: { variant: 'primary', size: 'sm' },
};

export const Large: Story = {
  args: { variant: 'primary', size: 'lg' },
};

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true },
};

export const Loading: Story = {
  args: { variant: 'primary', loading: true },
};
