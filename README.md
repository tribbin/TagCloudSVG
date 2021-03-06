## Demonstration

You may take a peek: [https://tribbin.github.io/TagCloudSVG/](https://tribbin.github.io/TagCloudSVG/)

## Example.html

The **[example.html](example.html)** file provides a good implementation example.

## Step-by-step

These are the necessary steps to build a TagCloudSVG.

* Download [TagCloudSVG](tagcloudsvg.js) and put it in the directory of your webpage.

* Call the tagcloudsvg.js script from your webpage:
```html
  <script src='tagcloudsvg.js' type='text/javascript'></script>
```
* Include an SVG-element in the body of your webpage with class 'tagcloudsvg':
```html
  <svg class='tagcloudsvg'></svg>
```
* Build a JSON array. All fields are optional, but 'label' will be used as the tag's element-text and 'class' (an array!) will be set as the tag's CSS classes.
```html
  <script>
    var clouds = [
        { "label": "Cirrus", "class": [ "high" ] },
        { "label": "Cirrocumulus", "class": ["high"] },
        { "label": "Cirrostratus", "class": ["high"] },
        { "label": "Altocumulus", "class": ["middle"] },
        { "label": "Altostratus", "class": ["middle"] },
        { "label": "Cumulonimbus", "class": ["vertical"] },
        { "label": "Cumulus", "class": ["vertical"] },
        { "label": "Nimbostratus", "class": ["vertical"] },
        { "label": "Stratocumulus", "class": ["low"] },
        { "label": "Small Cu", "class": ["low"] },
        { "label": "Stratus", "class": ["low"] },
    ];
  </script>
```
* Provide the JSON when creating TagCloudSVG:
```html
  <script>
    new TagCloudSVG(clouds);
  </script>
```
* Optionally use CSS to style the cloud and tags:
```html
  <style>
      #tagcloudsvg {
        background-color: black;
      }

      .tag {
        font-size: 4em;
      }

      .high {
        fill: white;
      }

      .middle {
        fill: blue;
      }

      .vertical {
        fill: darkblue;
      }

      .low {
        fill: grey;
      }
    </style>
```
## TagCloud data-structure

TagCloudSVG is built with flexibility in mind, but a few rules apply.

### Core rules

* The cloud-data is an array of objects.
* The object-property 'element' is reserved and must not be used.
* The object-properties 'id', 'class', 'label', 'node', 'link' and 'attributes' must only be used for their documented purpose.
* The class property, if present, *must* be an array.
* The attributes propery, if present, *must* be an array of properties.
* The class 'tag' is reserved and must not be used.
* Any object-property is optional; in the following code the value of 'cloud' is considered completely valid and must be accepted as input by TagCloudSVG:
```javascript
var cloud = [
	{ "id": "" },
	{ "label": "", "id": "clock", "class": [] },
	{},
	{ "link": "http://example.com/" },
	{ "type": "ellipse", "attributes": [{"cx": 0},{"cy": 0},{"rx": 100},{"ry": 50}], "id": "ellipe", "class": [ "inanimate", "large"], "node": [0,0,0] },
];
```
### Built-in features

* Every tag's element will be given the 'tag' CSS class.
* Every tag will be given the 'element' property, which is the tag's element.

#### Text-element content
```
"label": "value"
```

* The label property will set the text inside your SVG text-element.

#### CSS id
```
"id": "value"
```

* The id property will set the tag's CSS unique identity.

#### Clickable links
```
"link": "http://example.com/"
```

* The link property wraps a clickable link around your tag to the specified URL.

#### Additional CSS classes
```
"class": ["value","value", ... ]
```

* The class array will set the tag's CSS classes.

##### Inanimate tags
```
"class": ["inanimate"]
```

* The inanimate class will fix the position and size of the tag.

#### Alternative SVG-element types
```
"type": "value"
```

* Without a pre-defined 'type' property, there will be created an SVG Text-element for the tag.
* You can pre-define a different SVG Element-type; like rect, ellipse, svg, image, ...

#### Pre-defined SVG-object attributes
```
"attributes": [{"property": "value"},{"property": "value"}, ... ]
```

* The array of properties will be set as element-attributes with their corresponding values.

#### Pre-defined node coordinates
```
"node": [x,y,z]
```

* Without a pre-defined 'node' property, the tag will be given a coordination-node in the cloud.
* If you pre-define the node coordinates, you can choose the location yourself. Common values for x, y and z are between -1 and 1.
