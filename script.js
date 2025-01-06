document.addEventListener('DOMContentLoaded', function() {
    // Typewriter efekti için fonksiyon
    function typeWriter() {
        const element = document.querySelector('.typewriter');
        if (!element) return;
        
        const text = element.getAttribute('data-text') || "Ben Fatih Gülcü\nBir Mobil Geliştirici";
        element.textContent = ''; // İçeriği temizle
        let index = 0;

        function writeCharacter() {
            if (index < text.length) {
                if (text.charAt(index) === '\n' || text.charAt(index) === '&#10;') {
                    element.innerHTML += '<br>';
                } else {
                    element.innerHTML += text.charAt(index);
                }
                index++;
                setTimeout(writeCharacter, 100);
            }
        }

        writeCharacter();
    }

    // Canvas ve parçacık animasyonu
    const canvas = document.getElementById('particleCanvas');
    if (canvas) { // Canvas varsa devam et
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Fare pozisyonunu takip et
        let mouse = {
            x: null,
            y: null
        }
        window.addEventListener('mousemove', function(e) {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        // Parçacık sınıfı
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
            }

            update() {
                // Fare yakınındaki parçacıkları hareket ettir
                if (mouse.x && mouse.y) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        this.x -= dx/20;
                        this.y -= dy/20;
                    }
                }

                // Normal hareket
                this.x += this.speedX;
                this.y += this.speedY;

                // Ekran sınırlarını kontrol et
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Parçacık dizisi oluştur
        const particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }

        // Animasyon döngüsü
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Parçacıklar arasında çizgiler çiz
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - distance/1000})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        animate();
    }

    // GitHub projeleri
    async function fetchGitHubProjects() {
        try {
            const username = 'crowroser';
            const response = await fetch(`https://api.github.com/users/${username}/repos`);
            const projects = await response.json();

            const projectsContainer = document.querySelector('.projects');
            if (!projectsContainer) return;
            
            projectsContainer.innerHTML = '';
            
            projects.forEach(project => {
                const card = document.createElement('div');
                card.className = 'project-card';
                
                card.innerHTML = `
                    <h3>${project.name}</h3>
                    <p>${project.description || 'Bu proje için açıklama bulunmuyor.'}</p>
                    <div class="project-stats">
                        <span>⭐ ${project.stargazers_count}</span>
                        <span>🔄 ${project.forks_count}</span>
                    </div>
                    <div class="project-tags">
                        <span>${project.language || 'Belirtilmemiş'}</span>
                    </div>
                    <a href="${project.html_url}" class="project-link" target="_blank">Projeyi İncele</a>
                `;
                
                projectsContainer.appendChild(card);
            });
        } catch (error) {
            console.error('GitHub projeleri yüklenirken hata:', error);
        }
    }

    // Fonksiyonları çalıştır
    setTimeout(typeWriter, 500); // Biraz gecikme ekleyelim
    fetchGitHubProjects();
}); 