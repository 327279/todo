import os
import sys

# --- Data Structure (Foundational) ---
tasks = []
task_id_counter = 1

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def display_header():
    print("=" * 30)
    print("   EVOLUTION OF TODO (v1)   ")
    print("=" * 30)

# --- Task Operations (User Stories) ---

def add_task():
    global task_id_counter
    description = input("\nEnter task description: ").strip()
    if description:
        tasks.append({
            "id": task_id_counter,
            "description": description,
            "is_completed": False
        })
        print(f"✅ Task Added (ID: {task_id_counter})")
        task_id_counter += 1
    else:
        print("⚠ Description cannot be empty.")

def view_tasks():
    print("\n--- CURRENT TASKS ---")
    if not tasks:
        print("No tasks found.")
        return
    
    for task in tasks:
        status = "[X]" if task["is_completed"] else "[ ]"
        print(f"{task['id']}. {status} {task['description']}")

def complete_task():
    try:
        task_id = int(input("\nEnter Task ID to mark as complete: "))
        for task in tasks:
            if task["id"] == task_id:
                task["is_completed"] = True
                print(f"✅ Task {task_id} completed.")
                return
        print(f"⚠ ID {task_id} not found.")
    except ValueError:
        print("⚠ Please enter a valid numeric ID.")

def update_task():
    try:
        task_id = int(input("\nEnter Task ID to update: "))
        for task in tasks:
            if task["id"] == task_id:
                new_desc = input("Enter new description: ").strip()
                if new_desc:
                    task["description"] = new_desc
                    print(f"✅ Task {task_id} updated.")
                return
        print(f"⚠ ID {task_id} not found.")
    except ValueError:
        print("⚠ Please enter a valid numeric ID.")

def delete_task():
    try:
        task_id = int(input("\nEnter Task ID to delete: "))
        global tasks
        original_count = len(tasks)
        tasks = [t for t in tasks if t["id"] != task_id]
        if len(tasks) < original_count:
            print(f"✅ Task {task_id} deleted.")
        else:
            print(f"⚠ ID {task_id} not found.")
    except ValueError:
        print("⚠ Please enter a valid numeric ID.")

# --- Main Menu ---

def main():
    while True:
        display_header()
        view_tasks()
        
        print("\nOPTIONS:")
        print("1. Add Task")
        print("2. Mark as Complete")
        print("3. Update Task")
        print("4. Delete Task")
        print("Q. Quit")
        
        choice = input("\nChoice: ").strip().upper()
        
        if choice == '1':
            add_task()
        elif choice == '2':
            complete_task()
        elif choice == '3':
            update_task()
        elif choice == '4':
            delete_task()
        elif choice == 'Q':
            print("Goodbye!")
            break
        else:
            print("⚠ Invalid choice.")
        
        input("\nPress Enter to continue...")
        clear_screen()

if __name__ == "__main__":
    clear_screen()
    main()
