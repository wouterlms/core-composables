module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/airbnb',
    '@vue/typescript/recommended'
  ],

  plugins: ['putout'],

  parserOptions: {
    ecmaVersion: 2020,
  },

  settings: {
    'import/resolver': {
      node: {
        extensions: [
          '.js',
          '.ts',
          '.d.ts',
          '.json',
          '.vue'
        ],
      },
      alias: {
        map: [
          [
            '@',
            './src',
            '~',
            './'
          ]
        ],
        extensions: [
          '.js',
          '.vue',
          '.ts',
          '.d.ts'
        ],
      },
    },
  },

  rules: {
    'no-undef': 'off',
    'no-shadow': 'off',
    'no-param-reassign': 'off',
    'import/no-extraneous-dependencies': 'off',

    'putout/multiple-properties-destructuring': 'error',
    'putout/add-newline-before-function-call': 'error',
    'putout/add-newline-after-function-call': 'error',

    'sort-imports': [
      'error', {
        ignoreDeclarationSort: true,
      }
    ],

    /**
     * https://eslint.org/docs/rules/semi
     *
     * Disable ;
     */
    semi: ['error', 'never'],

    /**
     * https://eslint.org/docs/rules/max-len
     *
     * Max line length
     */
    'max-len': [
      'error', {
        code: 100,
        comments: 75,
        ignoreTrailingComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
      }
    ],

    /**
     * https://eslint.org/docs/rules/array-bracket-newline
     */
    'array-bracket-newline': [
      'error', {
        multiline: true,
        minItems: 3,
      }
    ],

    /**
     * https://eslint.org/docs/rules/array-bracket-spacing
     */
    'array-bracket-spacing': ['error', 'always'],

    /**
     * https://eslint.org/docs/rules/array-element-newline
     *
     * Wrap arrays
     */
    'array-element-newline': [
      'error', {
        minItems: 3,
      }
    ],

    /**
     * https://eslint.org/docs/rules/object-property-newline
     *
     * Wrap objects
     */
    'object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],

    /**
     * https://eslint.org/docs/rules/camelcase
     *
     * Allow camelcase properties (API)
     */
    camelcase: 'off',

    /**
     * https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/prefer-default-export.md
     */
    'import/prefer-default-export': 'warn',

    /**
     * https://eslint.org/docs/rules/comma-dangle
     *
     * Always add a trailing comma
     */
    'comma-dangle': [
      'error', {
        arrays: 'never',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'never',
        functions: 'never',
      }
    ],

    /**
     * https://eslint.org/docs/rules/object-curly-spacing
     *
     * Enforce consistent spacing inside braces
     */
    'object-curly-spacing': ['error', 'always'],

    /**
     * https://eslint.vuejs.org/rules/v-for-delimiter-style.html
     *
     * Only allow `of`
     * ✓ v-for="user of users"
     * ✗ v-for="user in users"
     */
    'vue/v-for-delimiter-style': ['error', 'of'],

    /**
     * https://eslint.vuejs.org/rules/v-on-event-hyphenation.html
     *
     * Only allow hyphenated event names
     * ✓ some-event
     * ✗ someEvent
     */
    'vue/v-on-event-hyphenation': [
      'error',
      'always',
      {
        autofix: true,
        ignore: [],
      }
    ],

    /**
     * https://eslint.vuejs.org/rules/v-on-function-call.html
     *
     * Forbid parentheses for method calls without arguments
     * ✓ @click="handleClick"
     * ✗ @click="handleClick()"
     */
    'vue/v-on-function-call': ['error', 'never'],

    /**
     * https://eslint.vuejs.org/rules/next-tick-style.html
     *
     * Only allow nextTick as a promise
     * ! (doesn't seem to work in script setup)
     * ✓ await nextTick() | nextTick().then()
     * ✗ nextTick(() => ...)
     */
    'vue/next-tick-style': ['error', 'promise'],

    /**
     * https://eslint.vuejs.org/rules/component-name-in-template-casing.html#pascalcase-registeredcomponentsonly-true-default
     *
     * Custom component names should be PascalCased
     * ✓ <UserList />
     * ✗ <user-list />
     */
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
      }
    ],

    /**
     * https://eslint.vuejs.org/rules/eqeqeq.html
     *
     * Enforce type-safe equality operators
     * ✓ a === b
     * ✗ a == b
     */
    'vue/eqeqeq': ['error', 'always'],

    /**
     * https://eslint.vuejs.org/rules/no-unused-refs.html
     *
     * Show an error when a ref is defined but unused
     */
    'vue/no-unused-refs': ['error'],

    /**
     * https://eslint.vuejs.org/rules/no-useless-mustaches.html
     *
     * Only use {{  }} when necessary
     * ✓ {{ foo }}
     * ✗ {{ 'Bar' }}
     */
    'vue/no-useless-mustaches': [
      'error', {
        ignoreIncludesComment: false,
        ignoreStringEscape: false,
      }
    ],

    /**
     *
     */
    'vue/no-useless-v-bind': [
      'error', {
        ignoreIncludesComment: false,
        ignoreStringEscape: false,
      }
    ],

    /**
     * https://eslint.vuejs.org/rules/block-tag-newline.html
     *
     * Enforce a linebreak after <script> and <template>
     */
    'vue/block-tag-newline': ['error'],

    /**
     * https://eslint.vuejs.org/rules/custom-event-name-casing.html
     *
     * Enforce event casing is PascalCase
     */
    'vue/custom-event-name-casing': [
      'error',
      'camelCase',
      {
        ignores: [],
      }
    ],

    /**
     * https://eslint.vuejs.org/rules/html-button-has-type.html
     *
     * Disallow usage of button without an explicit
     * type attribute
     */
    'vue/html-button-has-type': [
      'error', {
        button: true,
        submit: true,
        reset: true,
      }
    ],

    /**
     * https://eslint.vuejs.org/rules/html-comment-content-newline.html
     *
     * Enforce unified line brake in HTML comments
     */
    'vue/html-comment-content-newline': [
      'error',
      {
        singleline: 'ignore',
        multiline: 'always',
      },
      {
        exceptions: [],
      }
    ],

    /**
     * https://eslint.vuejs.org/rules/html-comment-content-spacing.html
     *
     * Enforce unified spacing in HTML comments
     */
    'vue/html-comment-content-spacing': [
      'error',
      'always',
      {
        exceptions: [],
      }
    ],

    /**
     * https://eslint.vuejs.org/rules/html-comment-indent.html
     *
     * Enforce consistent indentation in HTML comments
     */
    'vue/html-comment-indent': ['error', 2],

    /**
     * https://eslint.vuejs.org/rules/no-child-content.html
     *
     * Disallow element's child contents which would be
     * overwritten by a directive like v-html or v-text
     */
    'vue/no-child-content': ['error'],

    /**
     * https://eslint.vuejs.org/rules/no-duplicate-attr-inheritance.html
     *
     * Enforce inheritAttrs to be set to false when
     * using v-bind="$attrs"
     */
    'vue/no-duplicate-attr-inheritance': ['error'],

    /**
     * https://eslint.vuejs.org/rules/no-empty-component-block.html
     *
     * Disallow the <template> <script> <style> block to be empty
     */
    'vue/no-empty-component-block': ['warn'],

    /**
     * https://eslint.vuejs.org/rules/no-multiple-objects-in-class.html
     *
     * Disallow to pass multiple objects into array to class
     */
    'vue/no-multiple-objects-in-class': ['error'],

    /**
     * https://eslint.vuejs.org/rules/no-restricted-v-bind.html
     *
     * Show error for :v-if, :v-model, ...
     */
    'vue/no-restricted-v-bind': [
      'error', {
        argument: '/^v-/',
        message: 'Using `:v-xxx` is not allowed. Instead, remove `:` and use it as directive.',
      }
    ],

    /**
     * vue/no-template-target-blank
     *
     * Disallow target="_blank" attribute without
     * rel="noopener noreferrer"
     */
    'vue/no-template-target-blank': [
      'error', {
        allowReferrer: false,
        enforceDynamicLinks: 'always',
      }
    ],

    /**
     * https://eslint.vuejs.org/rules/padding-line-between-blocks.html
     *
     * Require or disallow padding lines between blocks
     */
    'vue/padding-line-between-blocks': ['error', 'always'],

    /**
     * https://eslint.vuejs.org/rules/prefer-separate-static-class.html
     *
     * Require static class names in template to be
     * in a separate class attribute
     */
    'vue/prefer-separate-static-class': ['error'],

    /**
     * https://eslint.vuejs.org/rules/static-class-names-order.html
     *
     * Enforce static class names order
     */
    'vue/static-class-names-order': ['error'],

    /**
     * https://eslint.vuejs.org/rules/no-irregular-whitespace.html
     *
     * Disallow irregular whitespace
     */
    'vue/no-irregular-whitespace': ['error'],

    /**
     * https://eslint.vuejs.org/rules/no-restricted-syntax.html
     *
     * ✓ {{ foo }}
     * ✗ {{ foo() }}
     */
    'vue/no-restricted-syntax': ['error'],

    /**
     * https://eslint.vuejs.org/rules/multi-word-component-names.html
     *
     * Allow component names to be single-word
     */
    'vue/multi-word-component-names': 'off',

    /**
     * https://eslint.vuejs.org/rules/no-setup-props-destructure.html
     *
     * Prop destructering is possible with `refTransform`
     */
    'vue/no-setup-props-destructure': 'off',
  },
}
