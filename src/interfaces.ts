export interface IFile {
  name: string;
  content: string;
}

export interface IAttrs {
  id?: string;
  [property: string]: string | number;
}

export interface ICleanOptions {
  /**
   * Strip comments.
   */
  stripComment?: boolean;
  /**
   * Strip empty `defs` tags.
   */
  stripEmptyDefinition?: boolean;
  /**
   * Strip empty `g` tags.
   */
  stripEmptyGroup?: boolean;
  /**
   * Strip `title` tags.
   */
  stripTitle?: boolean;
  /**
   * Strip `desc` tags.
   */
  stripDescription?: boolean;
  /**
   * Strip Sketch, xmlns and xmlns:* attributes.
   */
  stripExtraAttributes?: boolean;
  /**
   * Strip `fill` attributes and property (style="fill:*;").
   */
  stripFill?: boolean;
  /**
   * Strip `style` tags and attributes.
   */
  stripStyles?: boolean;
}

export interface IOptions {
  /**
   * Array glob-patterns for files that will not be added to the sprite.
   */
  ignore?: string[];
  /**
   * The attributes that will be added to the root `svg` tag.
   */
  parentAttrs?: IAttrs;
  /**
   * If you want to embed the sprite into your HTML source, you will want to set
   * this to `true` in order to prevent the creation of SVG namespace declarations
   * and to set some other attributes for effectively hiding the library sprite.
   */
  inline?: boolean;
  /**
   * The attributes of each icon. Current attribute values will be overwritten.
   */
  iconAttrs?: IAttrs;
  /**
   * The name prefix for each icon.
   */
  iconPrefix?: string;
  /**
   * The name suffix for each icon.
   */
  iconSuffix?: string;
  /**
   * Clean options.
   */
  clean?: ICleanOptions;
}

export interface IResult {
  /**
   * Sprite data.
   */
  sprite: string;
  /**
   * A feature that allows you to write the resulting sprite to disk.
   */
  write: (filepath: string) => void;
}
