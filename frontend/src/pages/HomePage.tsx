import { useState } from "react";

const navigation = [
  { name: "Transactions", href: "/transactions" },
  { name: "Stats", href: "/stats" },
  { name: "Chart", href: "/chart" },
];

export const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white">
      <header className="p-6 shadow">
        <nav className="flex justify-between">
          <div className="text-xl font-bold">Roxiler</div>
          <div className="hidden md:flex gap-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:underline"
              >
                {item.name}
              </a>
            ))}
          </div>
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </nav>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-100 p-4">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block py-2 text-gray-700 hover:underline"
            >
              {item.name}
            </a>
          ))}
        </div>
      )}

      <main className="p-8 text-center">
        <h1 className="text-3xl font-bold">Welcome to Roxiler!</h1>
        <p className="mt-4 text-gray-600">
          Navigate through Transactions, Stats, or Chart to explore the data.
        </p>
      </main>
    </div>
  );
};
