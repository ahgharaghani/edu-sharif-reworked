#!/usr/bin/env python3
import os
import sys
import time
import json
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

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
        print(f"[!] Could not start Firefox with service: {e}")
        driver = webdriver.Firefox(options=options)

    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "scraped_data")
    os.makedirs(out_dir, exist_ok=True)

    print("[*] Navigating to https://edu.sharif.edu ...")
    driver.get("https://edu.sharif.edu")

    print("[*] Waiting for user login...")
    logged_in = False
    start_time = time.time()
    
    while time.time() - start_time < 300:
        try:
            current_url = driver.current_url
            page_source = driver.page_source
            
            is_login_page = ("نام کاربری یا رمز عبور" in page_source or 
                             "ورود یکپارچه" in page_source or 
                             current_url.endswith("/login.do") and "name=\"mainform\"" in page_source or
                             current_url == "https://edu.sharif.edu/" and "name=\"mainform\"" in page_source)
            
            has_student_panel = (
                "خروج" in page_source or 
                "کارنامه" in page_source or 
                "topMenu" in page_source or 
                ("action.do" in current_url and not is_login_page)
            )

            if has_student_panel and not is_login_page:
                print(f"[+] Login detected! Current URL: {current_url}")
                logged_in = True
                break

        except Exception:
            pass
        
        time.sleep(1)

    if not logged_in:
        print("[-] Login timed out or cancelled.")
        driver.quit()
        return

    # Wait a moment for page stabilization
    time.sleep(2)

    # Save session cookies
    cookies = driver.get_cookies()
    with open(os.path.join(out_dir, "cookies.json"), "w", encoding="utf-8") as f:
        json.dump(cookies, f, ensure_ascii=False, indent=2)
    print(f"[+] Saved {len(cookies)} cookies to scraped_data/cookies.json")

    # Step 1: Navigate to ExamTab*DepthSearch
    print("[*] Navigating to امور کارنامه > وضعیت تحصیلی و ریزنمرات دانشجو...")
    try:
        driver.execute_script("document.headerMenuForm.changeMenu.value='ExamTab*DepthSearch';document.headerMenuForm.submit();")
    except Exception as e:
        print(f"[!] JavaScript menu navigation failed: {e}. Trying direct POST via requests or form...")

    time.sleep(3)

    # Step 2: Look for 'اطلاعات تحصیلی' form or button
    print("[*] Looking for 'اطلاعات تحصیلی' button (action.do?command=showInformation)...")
    try:
        # Save landing transcript.html
        with open(os.path.join(out_dir, "transcript.html"), "w", encoding="utf-8") as f:
            f.write(driver.page_source)

        submit_btn = None
        # Try finding submit button in form with action containing showInformation
        forms = driver.find_elements(By.CSS_SELECTOR, "form[action*='showInformation']")
        if forms:
            print("[+] Found form with action*='showInformation'")
            btns = forms[0].find_elements(By.CSS_SELECTOR, "input[type='submit'], button")
            if btns:
                submit_btn = btns[0]
            else:
                forms[0].submit()
                print("[+] Submitted form directly via submit()")
        else:
            # Fallback by value
            inputs = driver.find_elements(By.TAG_NAME, "input")
            for inp in inputs:
                val = inp.get_attribute("value") or ""
                if "اطلاعات" in val and "تحصیل" in val:
                    submit_btn = inp
                    break

        if submit_btn:
            print(f"[+] Clicking button: {submit_btn.get_attribute('value')}")
            submit_btn.click()
        else:
            print("[!] Could not find submit button by selector, checking if form already submitted or page source.")

        time.sleep(4)

        # Save full transcript HTML & screenshot
        full_html = driver.page_source
        with open(os.path.join(out_dir, "transcript_full.html"), "w", encoding="utf-8") as f:
            f.write(full_html)
        driver.save_screenshot(os.path.join(out_dir, "transcript_full.png"))
        print("[+] SUCCESS! Saved full transcript to scraped_data/transcript_full.html and screenshot to transcript_full.png")

        # Quick preview of table content
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(full_html, "html.parser")
        tables = soup.find_all("table")
        print(f"[+] Found {len(tables)} tables in full transcript page.")
        for idx, tbl in enumerate(tables):
            text = tbl.get_text(" ", strip=True)
            if any(term_kw in text for term_kw in ["نیمسال", "نیم‌سال", "نمره", "معدل", "شماره درس"]):
                print(f"--- Table #{idx} preview ---")
                rows = tbl.find_all("tr")
                for r in rows[:10]:
                    cells = [c.get_text(strip=True) for c in r.find_all(["td", "th"])]
                    if cells:
                        print("  | ".join(cells[:8]))

    except Exception as e:
        print(f"[!] Error during transcript scraping: {e}")

    print("[*] Completed! Closing browser...")
    driver.quit()

if __name__ == "__main__":
    main()
