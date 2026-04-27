import type { Meta, StoryObj } from '@storybook/angular';
import { UiCardComponent } from './ui-card';

const meta: Meta<UiCardComponent> = {
  title: 'UI/Card',
  component: UiCardComponent,
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `<ui-card [title]="title" [subtitle]="subtitle">
      <p>Cards group related content and actions in a single surface.</p>
    </ui-card>`,
  }),
};

export default meta;
type Story = StoryObj<UiCardComponent>;

export const WithHeader: Story = {
  args: {
    title: 'Recent Orders',
    subtitle: 'Last 7 days of activity',
  },
};

export const TitleOnly: Story = {
  args: { title: 'Statistics' },
};

export const ContentOnly: Story = {
  args: {},
  render: () => ({
    template: `<ui-card>
      <p>A card without a header — useful for plain surfaces.</p>
    </ui-card>`,
  }),
};
