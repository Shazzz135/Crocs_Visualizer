export default function Footer() {
  return (
    <footer className="bg-black text-white py-4 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-evenly gap-2 sm:gap-0 text-center">
        <p className="text-xs sm:text-sm md:text-base">
          &copy; {new Date().getFullYear()} Crocs Visualizer. All rights reserved.
        </p>

        <p className="text-xs sm:text-sm md:text-base">
          Made by Nick Shahbaz
        </p>
      </div>
    </footer>
  );
}