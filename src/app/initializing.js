import _ from 'lodash';
import yoOptionOrPrompt from 'yo-option-or-prompt';

export default async function initializing(yo) {
  yo.context = { _ };
  yo.optionOrPrompt = yoOptionOrPrompt;
}
