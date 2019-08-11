import _ from 'lodash';
import yoOptionOrPrompt from 'yo-option-or-prompt';
import util from './util';

export default async function initializing(yo) {
  yo.context = { _, ...util };
  yo.optionOrPrompt = yoOptionOrPrompt;
}
