#!/usr/bin/env node
/*
 * Initializer for closed-dataset-docs
 *
 * Copyright 2020 Human Dataware Lab. Co. Ltd.
 * Created by Daiki Hayashi (hayashi.daiki@hdwlab.co.jp)
 */

'use strict';

let fs = require('fs');
let path = require('path');

const searchExtensions = [
    '.md',
    '.html',
    '.txt',
]


const _generateSidebarContentsFromDir = (basePath,
                                         currentPath=null,
                                         depth=0,
                                         mindepth=0,
                                         maxdepth=10,
                                         urlPrefix='',
                                         includeReadme=false,
                                         includeSelf=false,
                                         includeParent=false) => {
    let contents = '';
    if (currentPath === null) {
        currentPath = basePath;
    }
    if (depth >= maxdepth) return contents;

    if (includeParent) {
        contents += '- [<- back]';
        contents += '(' + encodeURI(path.dirname(urlPrefix)) + '/';
        contents += ' "' + path.basename(basePath) + '")';
        contents += '\n';
    }

    if (includeSelf) {
        contents += '- [' + path.basename(basePath) + ']';
        contents += '(' + encodeURI(urlPrefix);
        contents += ' "' + path.basename(basePath) + '")';
        contents += '\n';
        contents += _generateSidebarContentsFromDir(
            basePath,
            currentPath,
            depth + 1,
            mindepth,
            maxdepth,
            urlPrefix,
            includeReadme,
            false,
            false);
        return contents;
    }

    let items = fs.readdirSync(currentPath);
    items.sort();

    // Directories
    items.filter((item) => {
        return fs.statSync(path.join(currentPath, item)).isDirectory()
    }).forEach((item) => {
        // Ignore directories which start with an underscore
        if (/^_.*/.test(item)) return;

        // Add content
        contents += ' '.repeat(depth * 2);
        contents += '- [' + item + ']';
        contents += '(' + encodeURI(urlPrefix + path.relative(basePath, path.join(currentPath, item))) + '/';
        contents += ' "' + item + '")';
        contents += '\n';
        contents += _generateSidebarContentsFromDir(
            basePath,
            path.join(currentPath, item),
            depth + 1,
            mindepth,
            maxdepth,
            urlPrefix,
            includeReadme,
            false,
            false);
    }, contents);

    // Delimiter
    // contents += '\n';

    if (depth < mindepth) return contents;

    // Files
    items.filter((item) => {
        return fs.statSync(path.join(currentPath, item)).isFile()
    }).forEach((item) => {
        // Ignore files
        if (item === 'index.html') return;
        if (/^_.*/.test(item)) return;
        if (!includeReadme && ['README.md', 'readme.md'].includes(item)) return;
        if (!searchExtensions.includes(path.parse(item).ext)) return;

        // Add content
        contents += ' '.repeat(depth * 2);
        contents += '- [' + path.parse(item).name + ']'
        contents += '(' + encodeURI(urlPrefix + path.relative(basePath, path.join(currentPath, item)));
        contents += ' "' + path.parse(item).name + '")';
        contents += '\n';
    }, contents);

    return contents;
}


const generateSidebar = (args) => {
    // Generate `_sidebar.md` regarding the contents in docs dir.
    let docsDir = args['docs_dir'].replace(/"/g, '');
    let urlPrefix = args['url_prefix'].replace(/"/g, '');
    let maxdepth = args['maxdepth'];
    let mindepth = 0;
    let includeReadme = args['include_readme'];
    let includeSelf = args['include_self'];
    let includeParent = args['include_parent'];

    const contents = _generateSidebarContentsFromDir(
        docsDir,
        null,
        0,
        mindepth,
        maxdepth,
        urlPrefix,
        includeReadme,
        includeSelf,
        includeParent);
    process.stdout.write(contents);
}


const generateNavbar = (args) => {
    // Generate `_navbar.md` regarding the contents in docs dir.
    const basePath = args['docs_dir'].replace(/"/g, '');
    const urlPrefix = args['url_prefix'].replace(/"/g, '');

    // Add contents
    let contents = '- ' + args['header'] + '\n';
    let items = fs.readdirSync(basePath);
    items.sort();

    items.filter((item) => {
        return fs.statSync(path.join(basePath, item)).isDirectory()
    }).forEach((item) => {
        contents += '  - [' + item + '](' + encodeURI(urlPrefix + item) + '/)' + '\n';
    }, contents);

    // Copy language part from root
    contents += fs.readFileSync(__dirname + '/../docs/_navbar.md').toString();

    process.stdout.write(contents);
}


const createParser = () => {
    // Create an argument-parser
    let ArgumentParser = require('argparse').ArgumentParser;
    let parser = new ArgumentParser({
        version: '0.1.0',
        addHelp: true,
        description: 'Initializer for closed-dataset-docs.'
    });

    // Prepare sub-commands
    let generateSidebar = parser.addSubparsers({
        title: 'Commands',
        dest: 'command'
    });

    // Sub-command: generate_sidebar
    let generateSidebarParser = generateSidebar.addParser('generate_sidebar', {addHelp: true})
    generateSidebarParser.addArgument(
        ['docs_dir'],
        {
            help: 'Path to a directory containing documents'
        }
    );
    generateSidebarParser.addArgument(
        ['--maxdepth'],
        {
            type: 'int',
            defaultValue: 1,
            help: 'Maximum depth'
        }
    );
    generateSidebarParser.addArgument(
        ['--url_prefix'],
        {
            defaultValue: '',
            help: 'Prefix to add to URL of each item'
        }
    );
    generateSidebarParser.addArgument(
        ['--include_self'],
        {
            action: 'storeTrue',
            help: 'If true, the docs-dir itself will be shown on the sidebar'
        }
    );
    generateSidebarParser.addArgument(
        ['--include_readme'],
        {
            action: 'storeTrue',
            help: 'If true, README files will be shown on the sidebar'
        }
    );
    generateSidebarParser.addArgument(
        ['--include_parent'],
        {
            action: 'storeTrue',
            help: 'If true, parent directory will be included to the sidebar'
        }
    );

    // Sub-command: generate_sidebar
    let generateNavbarParser = generateSidebar.addParser('generate_navbar', {addHelp: true})
    generateNavbarParser.addArgument(
        ['docs_dir'],
        {
            help: 'Path to a directory containing documents'
        }
    );
    generateNavbarParser.addArgument(
        ['--header'],
        {
            defaultValue: 'Databases',
            help: 'Header of the navigation column'
        }
    );
    generateNavbarParser.addArgument(
        ['--url_prefix'],
        {
            defaultValue: '',
            help: 'Prefix to add to URL of each item'
        }
    );

    // Return the parser
    return parser
}


// Call from terminal
const parser = createParser();
const args = parser.parseArgs();
if (args.command === 'generate_sidebar') {
    generateSidebar(args);
}
if (args.command === 'generate_navbar') {
    generateNavbar(args);
}
