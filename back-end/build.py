import subprocess

tag = input("input version tag x.x.x : ")
subprocess.run(["docker", "build", "-t", "swu-api", "."], check=True)
tagged_image = f"sayamphoo/swu-api:{tag}"
subprocess.run(["docker", "tag", "swu-api", tagged_image], check=True)
subprocess.run(["docker", "push", tagged_image], check=True)
