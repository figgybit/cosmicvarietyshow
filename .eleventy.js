module.exports = function(eleventyConfig) {

  // Passthrough copy
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/audio");
  eleventyConfig.addPassthroughCopy("src/video");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Date display filter
  eleventyConfig.addFilter("dateDisplay", function(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  });

  // Short date filter
  eleventyConfig.addFilter("dateShort", function(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "just now";
    if (diffHours < 24) return diffHours + "h ago";
    if (diffDays < 7) return diffDays + "d ago";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  // ISO date filter
  eleventyConfig.addFilter("isoDate", function(dateStr) {
    return new Date(dateStr).toISOString();
  });

  // Limit filter
  eleventyConfig.addFilter("limit", function(arr, count) {
    return arr.slice(0, count);
  });

  // Duration label filter
  eleventyConfig.addFilter("durationOnly", function(label) {
    if (!label) return "";
    var m = label.match(/\(([^)]+)\)/);
    if (m) return m[1];
    return label;
  });

  return {
    dir: {
      input: "src",
      output: "site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
