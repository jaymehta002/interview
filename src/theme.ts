export const theme = {
  primaryColor: "blue",
  defaultRadius: "md",
  white: "#ffffff",
  black: "#1A1B1E",
  colors: {
    gray: [
      "#f8f9fa",
      "#f1f3f5",
      "#e9ecef",
      "#dee2e6",
      "#ced4da",
      "#adb5bd",
      "#868e96",
      "#495057",
      "#343a40",
      "#212529",
    ],
  },
  components: {
    Button: {
      styles: {
        root: {
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
      },
    },
    Paper: {
      styles: {
        root: {
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
      },
    },
  },
};
