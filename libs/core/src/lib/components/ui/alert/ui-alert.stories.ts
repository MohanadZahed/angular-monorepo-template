import type { Meta, StoryObj } from '@storybook/angular';
import { UiAlertComponent } from './ui-alert';

const meta: Meta<UiAlertComponent> = {
  title: 'UI/Alert',
  component: UiAlertComponent,
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['success', 'error', 'warning', 'info'],
    },
    dismissible: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<ui-alert [type]="type" [dismissible]="dismissible">
      Order #4218 has been processed successfully.
    </ui-alert>`,
  }),
};

export default meta;
type Story = StoryObj<UiAlertComponent>;

export const Success: Story = {
  args: { type: 'success', dismissible: false },
};

export const Error: Story = {
  args: { type: 'error', dismissible: false },
};

export const Warning: Story = {
  args: { type: 'warning', dismissible: false },
};

export const Info: Story = {
  args: { type: 'info', dismissible: false },
};

export const Dismissible: Story = {
  args: { type: 'info', dismissible: true },
};
