import subprocess

tag = input("input version tag x.x.x : ")
subprocess.run(["docker", "build", "-t", "swu-font", "."], check=True)
tagged_image = f"sayamphoo/swu-font:{tag}"
subprocess.run(["docker", "tag", "swu-font", tagged_image], check=True)
subprocess.run(["docker", "push", tagged_image], check=True)
