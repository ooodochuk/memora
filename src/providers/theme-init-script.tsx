import { appThemeIds } from "@/lib/design-system/themes";

/** Runs before paint — restores saved theme class on `<html>` (next-themes). */
export function ThemeInitScript() {
  const themes = JSON.stringify(appThemeIds);
  const script = `(function(){var k="theme",t=${themes};try{var s=localStorage.getItem(k);var m=s&&t.indexOf(s)!==-1?s:"dark";document.documentElement.classList.add(m)}catch(e){document.documentElement.classList.add("dark")}})();`;

  return (
    <script
      // eslint-disable-next-line react/no-danger -- required for zero-flash theme init
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
