import _ from 'lodash';

function quote(input) {
  if (!input.length) return '';
  if (input[0] === '@') return `'${input}'`;
  if (input.indexOf(' ') > -1) return `'${input}'`;
  return input;
}

function spaceCase(input) {
  return _.snakeCase(input).replace(/_/g, ' ');
}

export { quote, spaceCase };
export default { quote, spaceCase };
