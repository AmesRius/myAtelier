        // JavaScript - シンプルなナビゲーション機能とアニメーション
        
        // ナビゲーション機能
        document.addEventListener('DOMContentLoaded', function() {
            const navItems = document.querySelectorAll('.nav-item');
            const sections = document.querySelectorAll('.section');
            
            // ナビゲーションクリックイベント
            navItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // アクティブクラスの切り替え
                    navItems.forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');
                    
                    // セクションの表示切り替え
                    const targetSection = this.getAttribute('data-section');
                    
                    sections.forEach(section => {
                        section.classList.add('hidden');
                    });
                    
                    const target = document.getElementById(targetSection);
                    if (target) {
                        target.classList.remove('hidden');
                        
                        // フェードインアニメーションの再実行
                        target.style.animation = 'none';
                        target.offsetHeight; // リフロー強制
                        target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                    }
                });
            });
            
            // 初期表示時のアニメーション
            setTimeout(() => {
                const cards = document.querySelectorAll('.card');
                cards.forEach((card, index) => {
                    card.style.animationDelay = `${index * 0.1}s`;
                    card.style.animation = 'fadeInUp 0.6s ease-out forwards';
                });
            }, 500);
            
            // スクロール時のパララックス効果（軽微）
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                const parallax = document.querySelector('body::before');
                
                // 背景要素の軽微な移動
                document.body.style.backgroundPosition = `center ${scrolled * 0.1}px`;
            });
            
            // カードのホバーエフェクト強化
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
            
            // プレースホルダーリンクのクリック時の説明
            //const placeholderLinks = document.querySelectorAll('.placeholder-link');
            //placeholderLinks.forEach(link => {
            //    link.addEventListener('click', function(e) {
            //        e.preventDefault();
            //        alert('このリンクは実際のファイルやURLを設定後に機能します。\n現在はプレースホルダーとして表示されています。');
            //    });
            //});
            
            // 画像プレースホルダーのクリック時の説明
            const placeholderImages = document.querySelectorAll('.placeholder-image');
            placeholderImages.forEach(image => {
                image.addEventListener('click', function() {
                    alert('ここに実際の画像や動画ファイルを配置してください。\n現在はプレースホルダーとして表示されています。');
                });
            });
        });
        
        // 追加のアニメーション関数
        function addSparkleEffect() {
            // 星の輝きエフェクト（省略可能）
            const sparkles = document.querySelectorAll('.section-title::after');
            sparkles.forEach(sparkle => {
                sparkle.style.animation = 'sparkle 2s infinite';
            });
        }
        
        // ページロード完了時の処理
        window.addEventListener('load', function() {
            // ローディング完了後の追加処理があればここに記載
            console.log('錬金術師の工房へようこそ！');
        });
