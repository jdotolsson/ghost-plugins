# Introduction

This plugin uses pure javascript to replace sections of specific formatted html elements with tabbed code elements.

Markdown formatted like this in the Ghost editor

```markdown
    # [CSharp](#tab/section_1)
    ```csharp
    var my = 5;
    ```

    # [GoLang](#tab/section_1)
    ```go
    my = 5
    ```
```

Will produce this content in html

```html
<!--kg-card-begin: markdown-->
    <h2 id="csharp"><a href="#tab/section_1">CSharp</a></h2>
    <pre
        class="language-csharp"
        tabindex="0">
        <code class="language-csharp">
            <span class="token class-name"><span class="token keyword">var</span></span> my <span class="token operator">=</span> <span class="token number">5</span><span class="token punctuation">;</span>
        </code>
    </pre>
    <h2 id="golang"><a href="#tab/section_1">GoLang</a></h2>
    <pre class="language-go" tabindex="0">
        <code class="language-go">my 
            <span class="token operator">=</span> <span class="token number">5</span>
        </code>
    </pre>
<!--kg-card-end: markdown-->

```

This plugin will replace the groups and sections with tabbed content
![Alt text](image.png)

## Installation

1. Put the style header of code injection.
2. Put the script footer section of code injection
