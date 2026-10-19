#!/usr/bin/env python3
import os
import sys
import time
import json
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By

def main():
    print("[*] Starting Selenium Firefox browser on display...")
    options = Options()
    options.add_argument("--width=1280")
    options.add_argument("--height=900")
    
    gecko_path = "/snap/bin/geckodriver"
    service = Service(gecko_path)
    
    try:
        driver = webdriver.Firefox(service=service, options=options)
    except Exception as e:
        print(f"[!] Could not start Firefox directly with {gecko_path}: {e}")
        driver = webdriver.Firefox(options=options)

    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "scraped_data")
    os.makedirs(out_dir, exist_ok=True)

    print("[*] Navigating to https://edu.sharif.edu ...")
    driver.get("https://edu.sharif.edu")

    print("[*] Browser window is now open on your screen!")
    print("[*] Please log in via the opened Firefox window (using credentials or SSO).")
    print("[*] Waiting for login to complete (monitoring URL and page state)...")

    logged_in = False
    start_time = time.time()
    
    while time.time() - start_time < 300:
        try:
            current_url = driver.current_url
            title = driver.title
            page_source = driver.page_source
            
            is_login_page = ("نام کاربری یا رمز عبور" in page_source or 
                             "ورود یکپارچه" in page_source or 
                             current_url.endswith("/login.do") and "name=\"mainform\"" in page_source or
                             current_url == "https://edu.sharif.edu/" and "name=\"mainform\"" in page_source)
            
            has_student_panel = (
                "خروج" in page_source or 
                "کارنامه" in page_source or 
                "برنامه هفتگی" in page_source or 
                "clsTableEvenRow" in page_source or 
                "topMenu" in page_source or 
                ("action.do" in current_url and not is_login_page)
            )

            if has_student_panel and not is_login_page:
                print(f"[+] LOGIN DETECTED! Current URL: {current_url} | Title: {title}")
                logged_in = True
                break

        except Exception as e:
            pass
        
        time.sleep(1)

    if not logged_in:
        print("[-] Login timed out or not detected.")
        driver.quit()
        return

    # Extract all cookies
    cookies = driver.get_cookies()
    with open(os.path.join(out_dir, "cookies.json"), "w", encoding="utf-8") as f:
        json.dump(cookies, f, ensure_ascii=False, indent=2)
    print(f"[+] Saved {len(cookies)} cookies to scraped_data/cookies.json")

    # Save initial landing dashboard HTML
    with open(os.path.join(out_dir, "dashboard.html"), "w", encoding="utf-8") as f:
        f.write(driver.page_source)
    print("[+] Saved dashboard.html")

    # Take screenshot
    driver.save_screenshot(os.path.join(out_dir, "dashboard.png"))
    print("[+] Saved dashboard screenshot to scraped_data/dashboard.png")

    # Scan for all links and frames in the student panel
    links = driver.find_elements(By.TAG_NAME, "a")
    menu_items = []
    for a in links:
        href = a.get_attribute("href")
        text = a.text.strip()
        if href and ("sharif.edu" in href or href.startswith("/")) and text:
            menu_items.append({"text": text, "href": href})

    with open(os.path.join(out_dir, "menu_links.json"), "w", encoding="utf-8") as f:
        json.dump(menu_items, f, ensure_ascii=False, indent=2)
    print(f"[+] Discovered {len(menu_items)} menu links in panel.")

    frames = driver.find_elements(By.TAG_NAME, "iframe") + driver.find_elements(By.TAG_NAME, "frame")
    print(f"[+] Found {len(frames)} frames/iframes.")
    for idx, frame in enumerate(frames):
        src = frame.get_attribute("src")
        name = frame.get_attribute("name")
        print(f"    Frame #{idx}: name={name}, src={src}")

    print("[*] Finished capturing active session!")
    driver.quit()

if __name__ == "__main__":
    main()
