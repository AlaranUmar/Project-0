import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function SidebarCloseButton() {
  const { setOpen, setOpenMobile, isMobile } = useSidebar();

  const handleClose = () => {
    if (isMobile) {
      setOpenMobile(false); // Closes the mobile sheet
    } else {
      setOpen(false); // Collapses the desktop sidebar
    }
  };

  return (
    <Button variant="ghost" onClick={handleClose}>
      Cancel
    </Button>
  );
}
