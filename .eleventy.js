module.exports = function(eleventyConfig) {

  // Passthrough copy
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/audio");
  eleventyConfig.addPassthroughCopy("src/video");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Date display filter
  eleventyConfig.addFilter("dateDisplay", function(dateObj) {
    if (!dateObj) return "";
    const date = new Date(dateObj);
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
  });

  // ISO date filter
  eleventyConfig.addFilter("isoDate", function(dateObj) {
    if (!dateObj) return "";
    return new Date(dateObj).toISOString();
  });

  // Limit filter
  eleventyConfig.addFilter("limit", function(arr, limit) {
    return arr.slice(0, limit);
  });

  return {
    templateFormats: ["njk", "md"],
    dir: {
      input: "src",
      output: "site",
      includes: "_includes",
      data: "_data"
    }
  };
};
