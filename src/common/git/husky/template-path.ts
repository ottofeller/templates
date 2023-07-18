import * as path from 'path'

export const sourceFolder = path.join(__dirname, '../../../..', 'src/common/git/husky/assets')
export const templateFile = 'husky-shell-script-template'
export const templateString = '{{COMMAND}}'
export const destinationFolder = '.husky'
